# PumpFun 3D Agent

A **simulation-first, fully supervised AI trading agent** for [pump.fun](https://pump.fun) on Solana — built with Next.js, Three.js, and a Node.js backend simulation engine.

> ⚠️ **No real capital is used.** All trading is simulated in paper-trading mode. Human approval is required before any simulated trade is executed.

---

## Architecture

```
pumpfun-3d-agent/
├── dashboard/       # Next.js 16 + TypeScript frontend
│   ├── app/         # App Router pages
│   ├── components/  # UI components (layout, 3D, dashboard, oversight)
│   ├── lib/         # Zustand store + mock data + utilities
│   └── types/       # Shared TypeScript types
│
└── agent/           # Node.js + TypeScript simulation backend
    └── src/
        ├── simulation/  # Paper-trading engine + scoring strategies
        ├── market/      # Simulated pump.fun market feed
        ├── api/         # REST API (Express)
        └── websocket/   # Real-time events (Socket.io)
```

## Pages

| Route | Description |
|---|---|
| `/overview` | Main dashboard — portfolio, equity curve, open positions, trade history |
| `/agent` | Three.js 3D visualizer of the agent's current state |
| `/market` | Live (simulated) pump.fun token feed with token detail panel |
| `/oversight` | Human approval queue — approve or reject every trade |
| `/simulation` | Full performance analytics (Sharpe, drawdown, win rate, etc.) |
| `/simulation/config` | Tune all simulation parameters via sliders |

## Getting Started

### Dashboard (frontend)

```bash
cd dashboard
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

### Agent (backend)

```bash
cd agent
npm install
npm run dev      # http://localhost:3001  (REST + WebSocket)
```

## Key Features

- **3D Agent Visualizer** — Three.js WebGL scene: icosahedron core with orbiting data rings and floating token nodes. Color and pulse rate reflect the agent's live status and confidence.
- **Simulation Engine** — Tick-based paper trading with momentum, volume, and holder-growth scoring strategies. Stop-loss and take-profit exit logic.
- **Human Oversight** — Every trade queued for human approval with a configurable timeout. Approve/reject via dashboard UI or REST API.
- **Live Market Feed** — Simulated pump.fun token stream with random-walk price updates, bonding curve progress, and holder counts.
- **Full Analytics** — Equity curve (24h), win rate, Sharpe ratio, max drawdown, best/worst trade.
- **Config Panel** — Tune starting capital, position sizing, confidence threshold, stop-loss, take-profit, and approval timeout at runtime.

## WebSocket Events (Agent → Dashboard)

| Event | Payload |
|---|---|
| `agent_update` | AgentState |
| `portfolio_update` | Portfolio |
| `pending_decision` | Trade + expiresAt |
| `trade_result` | Trade (simulated / rejected / cancelled) |
| `tokens_update` | PumpToken[] |

## REST API

```
GET  /api/health          — health check
GET  /api/status          — agent + portfolio snapshot
GET  /api/tokens          — current market feed
POST /api/decision        — { tradeId, approve: boolean }
POST /api/config          — SimulationConfig partial update
```

## Simulation Safety Guarantees

- No Solana wallet is created or connected
- No RPC calls are made to mainnet
- All SOL/USD values are synthetic
- Human approval gate is on by default
- Reset button wipes all state instantly
