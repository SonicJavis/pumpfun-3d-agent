import { create } from "zustand";
import type {
  AgentState,
  AgentStatus,
  PendingDecision,
  Portfolio,
  SimulationConfig,
  SimulationStats,
  Trade,
  PumpToken,
  EquityPoint,
} from "@/types";
import {
  MOCK_EQUITY_CURVE,
  MOCK_PORTFOLIO,
  MOCK_STATS,
  MOCK_TOKENS,
  MOCK_TRADE_HISTORY,
} from "@/lib/simulation/mockData";

// ─── State shape ─────────────────────────────────────────────────────────────

interface SimulationStore {
  // Agent
  agent: AgentState;
  setAgentStatus: (status: AgentStatus) => void;

  // Market
  tokens: PumpToken[];
  selectedToken: PumpToken | null;
  setSelectedToken: (token: PumpToken | null) => void;

  // Portfolio
  portfolio: Portfolio;

  // Trades
  tradeHistory: Trade[];
  pendingDecisions: PendingDecision[];
  approveTrade: (id: string) => void;
  rejectTrade: (id: string) => void;

  // Stats
  stats: SimulationStats;

  // Equity curve
  equityCurve: EquityPoint[];

  // Config
  config: SimulationConfig;
  updateConfig: (partial: Partial<SimulationConfig>) => void;

  // Simulation control
  isRunning: boolean;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_AGENT: AgentState = {
  status: "scanning",
  currentTarget: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  confidence: 0.74,
  reasoning:
    "Monitoring BKILL: 1h price up 23.4%, holder growth 42/hr, bonding curve 62%. Preparing buy signal.",
  lastAction: "Scanned 47 new tokens in the last 60s",
  uptime: 5400,
  tradesExecuted: 3,
  winRate: 0.667,
};

const DEFAULT_CONFIG: SimulationConfig = {
  startingCapitalUsd: 1500,
  maxPositionSizePercent: 5,
  maxConcurrentPositions: 4,
  minConfidence: 0.65,
  requireHumanApproval: true,
  approvalTimeoutSeconds: 120,
  stopLossPercent: 25,
  takeProfitPercent: 50,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  agent: DEFAULT_AGENT,
  setAgentStatus: (status) =>
    set((s) => ({ agent: { ...s.agent, status } })),

  tokens: MOCK_TOKENS,
  selectedToken: MOCK_TOKENS[0],
  setSelectedToken: (token) => set({ selectedToken: token }),

  portfolio: MOCK_PORTFOLIO,

  tradeHistory: MOCK_TRADE_HISTORY.filter((t) => t.status !== "pending_approval"),
  pendingDecisions: MOCK_TRADE_HISTORY.filter(
    (t) => t.status === "pending_approval"
  ).map((t) => ({
    id: t.id,
    trade: t,
    createdAt: t.timestamp,
    expiresAt: t.timestamp + DEFAULT_CONFIG.approvalTimeoutSeconds * 1000,
  })),

  approveTrade: (id) =>
    set((s) => ({
      pendingDecisions: s.pendingDecisions.filter((d) => d.id !== id),
      tradeHistory: [
        ...s.tradeHistory,
        {
          ...s.pendingDecisions.find((d) => d.id === id)!.trade,
          status: "approved" as const,
          timestamp: Date.now(),
          pnlUsd: undefined,
        },
      ],
    })),

  rejectTrade: (id) =>
    set((s) => ({
      pendingDecisions: s.pendingDecisions.filter((d) => d.id !== id),
      tradeHistory: [
        ...s.tradeHistory,
        {
          ...s.pendingDecisions.find((d) => d.id === id)!.trade,
          status: "rejected" as const,
          timestamp: Date.now(),
        },
      ],
    })),

  stats: MOCK_STATS,
  equityCurve: MOCK_EQUITY_CURVE,

  config: DEFAULT_CONFIG,
  updateConfig: (partial) =>
    set((s) => ({ config: { ...s.config, ...partial } })),

  isRunning: true,
  startSimulation: () =>
    set((s) => ({
      isRunning: true,
      agent: { ...s.agent, status: "scanning" },
    })),
  pauseSimulation: () =>
    set((s) => ({
      isRunning: false,
      agent: { ...s.agent, status: "paused" },
    })),
  resetSimulation: () =>
    set({
      isRunning: false,
      agent: { ...DEFAULT_AGENT, status: "idle", uptime: 0, tradesExecuted: 0 },
      portfolio: MOCK_PORTFOLIO,
      tradeHistory: [],
      pendingDecisions: [],
    }),
}));
