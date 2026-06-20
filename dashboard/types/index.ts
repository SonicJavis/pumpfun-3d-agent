// ─── Token / Market ──────────────────────────────────────────────────────────

export interface PumpToken {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  imageUri: string;
  createdAt: number; // unix ms
  marketCap: number; // USD
  priceUsd: number;
  volume24h: number;
  priceChange1h: number; // percent
  priceChange24h: number;
  holders: number;
  bondingCurveProgress: number; // 0–100
  isGraduated: boolean;
}

// ─── Agent / AI ──────────────────────────────────────────────────────────────

export type AgentStatus = "idle" | "scanning" | "evaluating" | "waiting_approval" | "executing" | "paused";

export interface AgentState {
  status: AgentStatus;
  currentTarget: string | null; // token mint
  confidence: number; // 0–1
  reasoning: string;
  lastAction: string;
  uptime: number; // seconds
  tradesExecuted: number;
  winRate: number; // 0–1
}

// ─── Trade / Order ───────────────────────────────────────────────────────────

export type TradeDirection = "buy" | "sell";
export type TradeStatus = "pending_approval" | "approved" | "rejected" | "simulated" | "cancelled";

export interface Trade {
  id: string;
  tokenMint: string;
  tokenSymbol: string;
  tokenName: string;
  direction: TradeDirection;
  amountSol: number;
  amountUsd: number;
  priceUsd: number;
  status: TradeStatus;
  timestamp: number;
  pnlUsd?: number;
  pnlPercent?: number;
  reasoning: string;
  confidence: number;
  riskScore: number; // 0–10
}

// ─── Portfolio ───────────────────────────────────────────────────────────────

export interface PortfolioPosition {
  tokenMint: string;
  tokenSymbol: string;
  tokenName: string;
  amountTokens: number;
  costBasisUsd: number;
  currentValueUsd: number;
  unrealizedPnlUsd: number;
  unrealizedPnlPercent: number;
  entryPrice: number;
  currentPrice: number;
}

export interface Portfolio {
  solBalance: number;
  usdBalance: number;
  startingUsd: number;
  positions: PortfolioPosition[];
  totalValueUsd: number;
  totalPnlUsd: number;
  totalPnlPercent: number;
}

// ─── Oversight / Decision ─────────────────────────────────────────────────────

export interface PendingDecision {
  id: string;
  trade: Trade;
  expiresAt: number; // unix ms — auto-reject after timeout
  createdAt: number;
}

// ─── Simulation ──────────────────────────────────────────────────────────────

export interface SimulationConfig {
  startingCapitalUsd: number;
  maxPositionSizePercent: number; // % of portfolio
  maxConcurrentPositions: number;
  minConfidence: number; // 0–1
  requireHumanApproval: boolean;
  approvalTimeoutSeconds: number;
  stopLossPercent: number;
  takeProfitPercent: number;
}

export interface SimulationStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnlUsd: number;
  totalPnlPercent: number;
  maxDrawdownPercent: number;
  sharpeRatio: number;
  avgTradeReturnPercent: number;
  bestTradeUsd: number;
  worstTradeUsd: number;
  avgHoldTimeSeconds: number;
}

// ─── Chart ───────────────────────────────────────────────────────────────────

export interface EquityPoint {
  timestamp: number;
  valueUsd: number;
  pnlUsd: number;
}
