import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import type { SimulationEngine } from "../simulation/engine";
import type { WsEvent } from "../types";

export function attachWebSocket(httpServer: HttpServer, engine: SimulationEngine): SocketServer {
  const io = new SocketServer(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`[WS] Client connected: ${socket.id}`);

    // Send immediate snapshot
    socket.emit("agent_update", { type: "agent_update", agent: engine.getAgent() });
    socket.emit("portfolio_update", { type: "portfolio_update", portfolio: engine.getPortfolio() });

    // Client can approve/reject decisions over WS as well
    socket.on("resolve_decision", (data: { tradeId: string; approve: boolean }) => {
      engine.resolveDecision(data.tradeId, data.approve);
    });

    socket.on("disconnect", () => {
      console.log(`[WS] Client disconnected: ${socket.id}`);
    });
  });

  // Relay all engine events to all connected clients
  const relay = (event: WsEvent) => io.emit(event.type, event);
  engine.on("agent_update", relay);
  engine.on("portfolio_update", relay);
  engine.on("pending_decision", relay);
  engine.on("trade_result", relay);

  return io;
}
