"use client";

import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatDuration, formatUsd, formatPct, pnlColor } from "@/lib/utils";
import { Play, Pause, RotateCcw, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  idle: "bg-gray-500",
  scanning: "bg-cyan-400",
  evaluating: "bg-blue-400",
  waiting_approval: "bg-yellow-400",
  executing: "bg-green-400",
  paused: "bg-gray-600",
};

const STATUS_LABELS: Record<string, string> = {
  idle: "Idle",
  scanning: "Scanning",
  evaluating: "Evaluating",
  waiting_approval: "Awaiting Approval",
  executing: "Executing",
  paused: "Paused",
};

export default function Header() {
  const { agent, portfolio, isRunning, startSimulation, pauseSimulation, resetSimulation, pendingDecisions } =
    useSimulationStore();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-800 h-14 shrink-0">
      {/* Agent status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "w-2.5 h-2.5 rounded-full",
              STATUS_COLORS[agent.status],
              agent.status === "scanning" && "animate-pulse"
            )}
          />
          <span className="text-sm text-gray-300 font-medium">
            {STATUS_LABELS[agent.status]}
          </span>
        </div>
        <span className="text-gray-600">·</span>
        <span className="text-xs text-gray-500">
          Uptime {formatDuration(agent.uptime)}
        </span>
        <span className="text-gray-600">·</span>
        <span className="text-xs text-gray-500">
          {agent.tradesExecuted} trades
        </span>
      </div>

      {/* Portfolio value */}
      <div className="flex items-center gap-4 text-sm">
        <div className="text-right">
          <p className="text-xs text-gray-500">Portfolio</p>
          <p className="text-white font-semibold">{formatUsd(portfolio.totalValueUsd)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total PnL</p>
          <p className={cn("font-semibold", pnlColor(portfolio.totalPnlUsd))}>
            {formatUsd(portfolio.totalPnlUsd)} ({formatPct(portfolio.totalPnlPercent)})
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {pendingDecisions.length > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <Bell size={13} className="text-yellow-400" />
            <span className="text-yellow-400 text-xs font-medium">
              {pendingDecisions.length} pending
            </span>
          </div>
        )}
        <button
          onClick={isRunning ? pauseSimulation : startSimulation}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
            isRunning
              ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20"
              : "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20"
          )}
        >
          {isRunning ? <Pause size={13} /> : <Play size={13} />}
          {isRunning ? "Pause" : "Resume"}
        </button>
        <button
          onClick={resetSimulation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border border-gray-700"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>
    </header>
  );
}
