"use client";

import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatDuration, formatPct, cn } from "@/lib/utils";
import { Brain, Activity, Target, Cpu } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  idle: "text-gray-400 bg-gray-400/10",
  scanning: "text-cyan-400 bg-cyan-400/10",
  evaluating: "text-blue-400 bg-blue-400/10",
  waiting_approval: "text-yellow-400 bg-yellow-400/10",
  executing: "text-green-400 bg-green-400/10",
  paused: "text-gray-500 bg-gray-500/10",
};

const STATUS_LABELS: Record<string, string> = {
  idle: "Idle",
  scanning: "Scanning Market",
  evaluating: "Evaluating Signal",
  waiting_approval: "Awaiting Approval",
  executing: "Executing Trade",
  paused: "Paused",
};

export default function AgentStatusCard() {
  const { agent } = useSimulationStore();

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cpu size={15} className="text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Agent Status</h3>
        </div>
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", STATUS_COLORS[agent.status])}>
          {STATUS_LABELS[agent.status]}
        </span>
      </div>

      {/* Confidence meter */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500 flex items-center gap-1">
            <Brain size={10} /> Confidence
          </span>
          <span className="text-white font-medium">{(agent.confidence * 100).toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              agent.confidence >= 0.75 ? "bg-green-500" :
              agent.confidence >= 0.6 ? "bg-yellow-500" : "bg-red-500"
            )}
            style={{ width: `${agent.confidence * 100}%` }}
          />
        </div>
      </div>

      {/* Reasoning */}
      <div className="mb-4 p-2.5 bg-blue-500/5 border border-blue-500/10 rounded-lg">
        <p className="text-[10px] text-blue-400 font-medium mb-1">Current Reasoning</p>
        <p className="text-xs text-gray-300 leading-relaxed">{agent.reasoning}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 mb-1">
            <Activity size={9} /> Uptime
          </div>
          <p className="text-sm font-semibold text-white">{formatDuration(agent.uptime)}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 mb-1">
            <Target size={9} /> Win Rate
          </div>
          <p className="text-sm font-semibold text-cyan-400">{formatPct(agent.winRate * 100, 0)}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 mb-1">
            <Cpu size={9} /> Trades
          </div>
          <p className="text-sm font-semibold text-white">{agent.tradesExecuted}</p>
        </div>
      </div>
    </div>
  );
}
