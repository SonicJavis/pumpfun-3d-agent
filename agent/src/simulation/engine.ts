/**
 * Paper-trading simulation engine.
 *
 * The engine scans the market feed on each tick, scores tokens,
 * optionally queues trades for human approval, then simulates
 * execution with no real capital.
 */
import { v4 as uuid } from "uuid";
import { EventEmitter } from "events";
import type {
  AgentState,
  AgentStatus,
  Portfolio,
  PumpToken,
  SimulationConfig,
  Trade,
  WsEvent,
} from "../types";
import { evaluateToken } from "./strategies";

const SOL_PRICE_USD = 150; // approximate — for simulation only

interface Position {
  tokenMint: string;
  tokenSymbol: string;
  tokenName: string;
  amountTokens: number;
  entryPriceUsd: number;
  costBasisUsd: number;
  openedAt: number;
}

export class SimulationEngine extends EventEmitter {
  private config: SimulationConfig;
  private agent: AgentState;
  private portfolio: Portfolio;
  private positions: Map<string, Position> = new Map();
  private pendingApprovals: Map<string, { trade: Trade; expiresAt: number }> = new Map();
  private startedAt: number = Date.now();

  constructor(config: SimulationConfig) {
    super();
    this.config = config;
    this.agent = {
      status: "idle",
      currentTarget: null,
      confidence: 0,
      reasoning: "Agent initialised. Awaiting first scan.",
      lastAction: "Initialised",
      uptime: 0,
      tradesExecuted: 0,
      winRate: 0,
    };
    this.portfolio = {
      solBalance: config.startingCapitalUsd / SOL_PRICE_USD,
      usdBalance: config.startingCapitalUsd,
      startingUsd: config.startingCapitalUsd,
      totalValueUsd: config.startingCapitalUsd,
      totalPnlUsd: 0,
      totalPnlPercent: 0,
    };
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  getAgent(): AgentState {
    return { ...this.agent };
  }

  getPortfolio(): Portfolio {
    return { ...this.portfolio };
  }

  updateConfig(partial: Partial<SimulationConfig>): void {
    this.config = { ...this.config, ...partial };
  }

  /** Called on every market tick with fresh token data. */
  onMarketTick(tokens: PumpToken[]): void {
    this.agent.uptime = Math.floor((Date.now() - this.startedAt) / 1000);
    this.checkExpiredApprovals();
    this.updateOpenPositions(tokens);
    this.scanForEntries(tokens);
    this.emit("agent_update", { type: "agent_update", agent: this.getAgent() } satisfies WsEvent);
    this.emit("portfolio_update", { type: "portfolio_update", portfolio: this.getPortfolio() } satisfies WsEvent);
  }

  /** Human approves or rejects a pending decision. */
  resolveDecision(tradeId: string, approve: boolean): void {
    const entry = this.pendingApprovals.get(tradeId);
    if (!entry) return;
    this.pendingApprovals.delete(tradeId);
    const trade = { ...entry.trade };

    if (approve) {
      trade.status = "simulated";
      this.executeSimulatedTrade(trade);
    } else {
      trade.status = "rejected";
    }
    this.emit("trade_result", { type: "trade_result", trade } satisfies WsEvent);
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private setStatus(status: AgentStatus): void {
    this.agent.status = status;
  }

  private scanForEntries(tokens: PumpToken[]): void {
    // Skip if too many open positions or capital exhausted
    if (this.positions.size >= this.config.maxConcurrentPositions) return;
    if (this.portfolio.usdBalance < 10) return;

    this.setStatus("scanning");
    this.agent.lastAction = `Scanned ${tokens.length} tokens`;

    // Find the best candidate not already held
    const candidates = tokens
      .filter((t) => !this.positions.has(t.mint))
      .map((t) => ({ token: t, ...evaluateToken(t) }))
      .filter((c) => c.confidence >= this.config.minConfidence)
      .sort((a, b) => b.confidence - a.confidence);

    if (candidates.length === 0) {
      this.setStatus("scanning");
      return;
    }

    const best = candidates[0];
    this.setStatus("evaluating");
    this.agent.currentTarget = best.token.mint;
    this.agent.confidence = best.confidence;
    this.agent.reasoning = best.reasoning;

    const positionUsd = Math.min(
      this.portfolio.usdBalance * (this.config.maxPositionSizePercent / 100),
      this.portfolio.usdBalance
    );

    const trade: Trade = {
      id: uuid(),
      tokenMint: best.token.mint,
      tokenSymbol: best.token.symbol,
      tokenName: best.token.name,
      direction: "buy",
      amountSol: positionUsd / SOL_PRICE_USD,
      amountUsd: positionUsd,
      priceUsd: best.token.priceUsd,
      status: "pending_approval",
      timestamp: Date.now(),
      reasoning: best.reasoning,
      confidence: best.confidence,
      riskScore: best.riskScore,
    };

    if (this.config.requireHumanApproval) {
      const expiresAt = Date.now() + this.config.approvalTimeoutSeconds * 1000;
      this.pendingApprovals.set(trade.id, { trade, expiresAt });
      this.setStatus("waiting_approval");
      this.emit("pending_decision", {
        type: "pending_decision",
        trade,
        expiresAt,
      } satisfies WsEvent);
    } else {
      trade.status = "simulated";
      this.executeSimulatedTrade(trade);
    }
  }

  private executeSimulatedTrade(trade: Trade): void {
    this.setStatus("executing");

    // Deduct from portfolio
    this.portfolio.usdBalance -= trade.amountUsd;
    this.portfolio.solBalance = this.portfolio.usdBalance / SOL_PRICE_USD;

    // Open position
    const amountTokens = trade.amountUsd / trade.priceUsd;
    this.positions.set(trade.tokenMint, {
      tokenMint: trade.tokenMint,
      tokenSymbol: trade.tokenSymbol,
      tokenName: trade.tokenName,
      amountTokens,
      entryPriceUsd: trade.priceUsd,
      costBasisUsd: trade.amountUsd,
      openedAt: Date.now(),
    });

    this.agent.tradesExecuted += 1;
    this.agent.lastAction = `Opened ${trade.tokenSymbol} @ $${trade.priceUsd.toFixed(8)}`;
    this.setStatus("scanning");
    this.refreshPortfolioValue();
  }

  private updateOpenPositions(tokens: PumpToken[]): void {
    for (const [mint, pos] of this.positions.entries()) {
      const token = tokens.find((t) => t.mint === mint);
      if (!token) continue;

      const currentValue = pos.amountTokens * token.priceUsd;
      const pnlUsd = currentValue - pos.costBasisUsd;
      const pnlPct = (pnlUsd / pos.costBasisUsd) * 100;

      // Exit on stop-loss or take-profit
      if (pnlPct <= -this.config.stopLossPercent || pnlPct >= this.config.takeProfitPercent) {
        this.closePosition(mint, token, pnlUsd, pnlPct);
      }
    }
    this.refreshPortfolioValue(tokens);
  }

  private closePosition(
    mint: string,
    token: PumpToken,
    pnlUsd: number,
    pnlPercent: number
  ): void {
    const pos = this.positions.get(mint);
    if (!pos) return;
    this.positions.delete(mint);

    const proceeds = pos.costBasisUsd + pnlUsd;
    this.portfolio.usdBalance += proceeds;
    this.portfolio.solBalance = this.portfolio.usdBalance / SOL_PRICE_USD;

    // Update win rate
    const wins = pnlUsd > 0 ? 1 : 0;
    this.agent.winRate =
      (this.agent.winRate * (this.agent.tradesExecuted - 1) + wins) /
      this.agent.tradesExecuted;

    const trade: Trade = {
      id: uuid(),
      tokenMint: mint,
      tokenSymbol: pos.tokenSymbol,
      tokenName: pos.tokenName,
      direction: "sell",
      amountSol: proceeds / SOL_PRICE_USD,
      amountUsd: proceeds,
      priceUsd: token.priceUsd,
      status: "simulated",
      timestamp: Date.now(),
      pnlUsd,
      pnlPercent,
      reasoning: `Exit triggered: PnL ${pnlPercent.toFixed(1)}%`,
      confidence: 1,
      riskScore: 0,
    };

    this.agent.lastAction = `Closed ${pos.tokenSymbol} — PnL ${pnlUsd >= 0 ? "+" : ""}${pnlUsd.toFixed(2)} USD`;
    this.emit("trade_result", { type: "trade_result", trade } satisfies WsEvent);
  }

  private checkExpiredApprovals(): void {
    const now = Date.now();
    for (const [id, entry] of this.pendingApprovals.entries()) {
      if (now >= entry.expiresAt) {
        this.pendingApprovals.delete(id);
        const trade = { ...entry.trade, status: "cancelled" as const };
        this.emit("trade_result", { type: "trade_result", trade } satisfies WsEvent);
        if (this.agent.status === "waiting_approval") this.setStatus("scanning");
      }
    }
  }

  private refreshPortfolioValue(tokens?: PumpToken[]): void {
    let positionsValue = 0;
    if (tokens) {
      for (const [mint, pos] of this.positions.entries()) {
        const token = tokens.find((t) => t.mint === mint);
        if (token) positionsValue += pos.amountTokens * token.priceUsd;
      }
    }
    this.portfolio.totalValueUsd = this.portfolio.usdBalance + positionsValue;
    this.portfolio.totalPnlUsd = this.portfolio.totalValueUsd - this.config.startingCapitalUsd;
    this.portfolio.totalPnlPercent =
      (this.portfolio.totalPnlUsd / this.config.startingCapitalUsd) * 100;
  }
}
