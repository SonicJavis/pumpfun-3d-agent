"use client";

import { useSimulationStore } from "@/lib/store/simulationStore";
import { cn } from "@/lib/utils";
import { ShieldCheck, Eye, Lock, Zap } from "lucide-react";

export default function OversightPanel() {
  const { config, updateConfig, stats } = useSimulationStore();

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
        <ShieldCheck size={15} className="text-cyan-400" />
        <h3 className="text-sm font-semibold text-white">Oversight Controls</h3>
      </div>
      <div className="p-4 space-y-4">

        {/* Human approval toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-gray-400" />
            <div>
              <p className="text-sm text-white font-medium">Require Human Approval</p>
              <p className="text-xs text-gray-500">All trades need manual sign-off</p>
            </div>
          </div>
          <button
            onClick={() => updateConfig({ requireHumanApproval: !config.requireHumanApproval })}
            className={cn(
              "relative w-10 h-5 rounded-full transition-colors",
              config.requireHumanApproval ? "bg-cyan-500" : "bg-gray-700"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                config.requireHumanApproval ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
        </div>

        {/* No real capital indicator */}
        <div className="flex items-center gap-2 p-2.5 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
          <Lock size={13} className="text-yellow-400 shrink-0" />
          <div>
            <p className="text-xs text-yellow-400 font-medium">Simulation Mode Active</p>
            <p className="text-[10px] text-gray-500">No real Solana wallets or capital are used</p>
          </div>
        </div>

        {/* Oversight stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-800 rounded-lg p-2 text-center">
            <p className="text-[10px] text-gray-500">Total Trades</p>
            <p className="text-base font-bold text-white">{stats.totalTrades}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-2 text-center">
            <p className="text-[10px] text-gray-500">Approved</p>
            <p className="text-base font-bold text-green-400">{stats.winningTrades}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-2 text-center">
            <p className="text-[10px] text-gray-500">Rejected</p>
            <p className="text-base font-bold text-red-400">{stats.losingTrades}</p>
          </div>
        </div>

        {/* Approval timeout */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400 flex items-center gap-1">
              <Zap size={11} /> Approval Timeout
            </span>
            <span className="text-white font-medium">{config.approvalTimeoutSeconds}s</span>
          </div>
          <input
            type="range"
            min={30}
            max={300}
            step={30}
            value={config.approvalTimeoutSeconds}
            onChange={(e) => updateConfig({ approvalTimeoutSeconds: Number(e.target.value) })}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] text-gray-600">
            <span>30s</span><span>300s</span>
          </div>
        </div>

        {/* Min confidence */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Min AI Confidence</span>
            <span className="text-white font-medium">{(config.minConfidence * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={0.95}
            step={0.05}
            value={config.minConfidence}
            onChange={(e) => updateConfig({ minConfidence: Number(e.target.value) })}
            className="w-full accent-cyan-500"
          />
        </div>
      </div>
    </div>
  );
}
