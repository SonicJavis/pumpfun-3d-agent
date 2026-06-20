// ─── Shared types (mirrors dashboard/types/index.ts) ─────────────────────────

export type AgentStatus =
  | "idle"
  | "scanning"
  | "evaluating"
  | "waiting_approval"
  | "executing"
  | "paused";

export type TradeDirection = "buy" | "sell";
export type TradeStatus =
  | "pending_approval"
  | "approved"
  | "rejected"
  | "simulated"
  | "cancelled";

export interface PumpToken {
  mint: string;
  symbol: string;
  name: string;
  priceUsd: number;
  marketCap: number;
  volume24h: number;
  priceChange1h: number;
  priceChange24h: number;
  holders: number;
  bondingCurveProgress: number;
  isGraduated: boolean;
  createdAt: number;
}

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
  riskScore: number;
}

export interface AgentState {
  status: AgentStatus;
  currentTarget: string | null;
  confidence: number;
  reasoning: string;
  lastAction: string;
  uptime: number;
  tradesExecuted: number;
  winRate: number;
}

export interface Portfolio {
  solBalance: number;
  usdBalance: number;
  startingUsd: number;
  totalValueUsd: number;
  totalPnlUsd: number;
  totalPnlPercent: number;
}

export interface SimulationConfig {
  startingCapitalUsd: number;
  maxPositionSizePercent: number;
  maxConcurrentPositions: number;
  minConfidence: number;
  requireHumanApproval: boolean;
  approvalTimeoutSeconds: number;
  stopLossPercent: number;
  takeProfitPercent: number;
}

// WebSocket event payloads
export interface WsAgentUpdate {
  type: "agent_update";
  agent: AgentState;
}
export interface WsTokensUpdate {
  type: "tokens_update";
  tokens: PumpToken[];
}
export interface WsPendingDecision {
  type: "pending_decision";
  trade: Trade;
  expiresAt: number;
}
export interface WsTradeResult {
  type: "trade_result";
  trade: Trade;
}
export interface WsPortfolioUpdate {
  type: "portfolio_update";
  portfolio: Portfolio;
}

export type WsEvent =
  | WsAgentUpdate
  | WsTokensUpdate
  | WsPendingDecision
  | WsTradeResult
  | WsPortfolioUpdate;
