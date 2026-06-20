import express from "express";
import cors from "cors";
import type { SimulationEngine } from "../simulation/engine";
import type { MarketFeed } from "../market/pumpfunFeed";

export function createApiRouter(engine: SimulationEngine, feed: MarketFeed) {
  const router = express.Router();
  router.use(cors());
  router.use(express.json());

  // GET /api/status — agent + portfolio snapshot
  router.get("/status", (_req, res) => {
    res.json({
      agent: engine.getAgent(),
      portfolio: engine.getPortfolio(),
    });
  });

  // GET /api/tokens — current market feed snapshot
  router.get("/tokens", (_req, res) => {
    res.json({ tokens: feed.getTokens() });
  });

  // POST /api/decision — approve or reject a pending trade
  router.post("/decision", (req, res) => {
    const { tradeId, approve } = req.body as {
      tradeId?: string;
      approve?: boolean;
    };
    if (!tradeId || typeof approve !== "boolean") {
      res.status(400).json({ error: "tradeId (string) and approve (boolean) are required" });
      return;
    }
    engine.resolveDecision(tradeId, approve);
    res.json({ ok: true });
  });

  // POST /api/config — update simulation parameters
  router.post("/config", (req, res) => {
    engine.updateConfig(req.body);
    res.json({ ok: true });
  });

  // GET /api/health
  router.get("/health", (_req, res) => {
    res.json({ status: "ok", ts: Date.now() });
  });

  return router;
}
