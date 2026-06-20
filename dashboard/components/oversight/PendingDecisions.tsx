"use client";

import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatUsd, formatRelativeTime, riskColor, cn } from "@/lib/utils";
import { CheckCircle, XCircle, Clock, AlertTriangle, ArrowUpRight } from "lucide-react";

export default function PendingDecisions() {
  const { pendingDecisions, approveTrade, rejectTrade } = useSimulationStore();

  if (pendingDecisions.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
        <CheckCircle size={28} className="text-green-400 mx-auto mb-2" />
        <p className="text-white font-medium">All clear</p>
        <p className="text-gray-500 text-sm mt-1">No decisions awaiting your approval</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pendingDecisions.map(({ id, trade, expiresAt }) => {
        const msLeft = expiresAt - Date.now();
        const secsLeft = Math.max(0, Math.floor(msLeft / 1000));
        const isUrgent = secsLeft < 30;

        return (
          <div
            key={id}
            className={cn(
              "bg-gray-900 border rounded-xl p-4",
              isUrgent ? "border-yellow-500/50" : "border-gray-800"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-400/10 rounded-lg">
                  <ArrowUpRight size={14} className="text-green-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{trade.tokenSymbol}</span>
                    <span className="text-green-400 text-xs font-medium uppercase">
                      {trade.direction}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{trade.tokenName}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                {isUrgent && <AlertTriangle size={12} className="text-yellow-400" />}
                <Clock size={12} />
                <span className={isUrgent ? "text-yellow-400 font-medium" : ""}>
                  {secsLeft}s left
                </span>
              </div>
            </div>

            {/* Trade details */}
            <div className="grid grid-cols-3 gap-3 mb-3 bg-gray-800/50 rounded-lg p-3">
              <div>
                <p className="text-[10px] text-gray-500 mb-0.5">Amount</p>
                <p className="text-sm text-white font-medium">{formatUsd(trade.amountUsd)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-0.5">Confidence</p>
                <p className="text-sm text-cyan-400 font-medium">
                  {(trade.confidence * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-0.5">Risk Score</p>
                <p className={cn("text-sm font-medium", riskColor(trade.riskScore))}>
                  {trade.riskScore.toFixed(1)} / 10
                </p>
              </div>
            </div>

            {/* AI reasoning */}
            <div className="mb-3 p-2.5 bg-blue-500/5 border border-blue-500/10 rounded-lg">
              <p className="text-[10px] text-blue-400 font-medium mb-1">Agent Reasoning</p>
              <p className="text-xs text-gray-300">{trade.reasoning}</p>
            </div>

            {/* Confidence bar */}
            <div className="mb-3">
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>AI Confidence</span>
                <span>{(trade.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all"
                  style={{ width: `${trade.confidence * 100}%` }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => approveTrade(id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-green-500/10 text-green-400 text-sm font-medium hover:bg-green-500/20 border border-green-500/20 transition-colors"
              >
                <CheckCircle size={14} />
                Approve Trade
              </button>
              <button
                onClick={() => rejectTrade(id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 border border-red-500/20 transition-colors"
              >
                <XCircle size={14} />
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
