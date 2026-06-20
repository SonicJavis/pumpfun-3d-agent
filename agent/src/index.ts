import http from "http";
import express from "express";
import { MarketFeed } from "./market/pumpfunFeed";
import { SimulationEngine } from "./simulation/engine";
import { createApiRouter } from "./api/routes";
import { attachWebSocket } from "./websocket/server";
import type { SimulationConfig } from "./types";

const PORT = parseInt(process.env.PORT ?? "3001", 10);

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

async function main() {
  const app = express();
  const httpServer = http.createServer(app);

  // ── Services ────────────────────────────────────────────────────────────────
  const feed = new MarketFeed();
  const engine = new SimulationEngine(DEFAULT_CONFIG);

  // ── Routes + WebSocket ──────────────────────────────────────────────────────
  app.use("/api", createApiRouter(engine, feed));
  attachWebSocket(httpServer, engine);

  // ── Wire market → engine ────────────────────────────────────────────────────
  feed.onUpdate((tokens) => engine.onMarketTick(tokens));
  feed.start(3000); // tick every 3 seconds

  // ── Start ───────────────────────────────────────────────────────────────────
  httpServer.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║   PumpFun 3D Agent — Simulation Backend          ║
║   HTTP  → http://localhost:${PORT}/api           ║
║   WS    → ws://localhost:${PORT}                 ║
║   Mode  → SIMULATION (no real capital)           ║
╚══════════════════════════════════════════════════╝
    `.trim());
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    feed.stop();
    httpServer.close();
  });
}

main().catch((err) => {
  console.error("[Fatal]", err);
  process.exit(1);
});
