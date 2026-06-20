"use client";

import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatUsd, formatPct, formatRelativeTime, pnlColor, cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle } from "lucide-react";

const STATUS_CONFIG = {
  simulated: { label: "Simulated", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  approved: { label: "Approved", color: "text-green-400", bg: "bg-green-400/10" },
  rejected: { label: "Rejected", color: "text-red-400", bg: "bg-red-400/10" },
  pending_approval: { label: "Pending", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  cancelled: { label: "Cancelled", color: "text-gray-400", bg: "bg-gray-400/10" },
};

export default function TradeHistory() {
  const { tradeHistory } = useSimulationStore();
  const sorted = [...tradeHistory].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-white">Trade History</h3>
        <span className="text-xs text-gray-500">{sorted.length} trades</span>
      </div>
      <div className="divide-y divide-gray-800">
        {sorted.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-8">No trades yet</p>
        )}
        {sorted.map((trade) => {
          const statusCfg = STATUS_CONFIG[trade.status] ?? STATUS_CONFIG.simulated;
          const isBuy = trade.direction === "buy";
          return (
            <div key={trade.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors">
              {/* Direction icon */}
              <div className={cn("p-1.5 rounded-lg", isBuy ? "bg-green-400/10" : "bg-red-400/10")}>
                {isBuy ? (
                  <ArrowUpRight size={14} className="text-green-400" />
                ) : (
                  <ArrowDownRight size={14} className="text-red-400" />
                )}
              </div>

              {/* Token + details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{trade.tokenSymbol}</span>
                  <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", statusCfg.bg, statusCfg.color)}>
                    {statusCfg.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{trade.reasoning}</p>
              </div>

              {/* Amount */}
              <div className="text-right shrink-0">
                <p className="text-sm text-white">{formatUsd(trade.amountUsd)}</p>
                <p className="text-xs text-gray-500 flex items-center justify-end gap-0.5">
                  <Clock size={10} />
                  {formatRelativeTime(trade.timestamp)}
                </p>
              </div>

              {/* PnL */}
              <div className="text-right shrink-0 w-20">
                {trade.pnlUsd !== undefined ? (
                  <>
                    <p className={cn("text-sm font-medium", pnlColor(trade.pnlUsd))}>
                      {formatUsd(trade.pnlUsd)}
                    </p>
                    <p className={cn("text-xs", pnlColor(trade.pnlUsd))}>
                      {formatPct(trade.pnlPercent ?? 0)}
                    </p>
                  </>
                ) : trade.status === "rejected" ? (
                  <XCircle size={14} className="text-red-400 ml-auto" />
                ) : trade.status === "approved" ? (
                  <CheckCircle size={14} className="text-green-400 ml-auto" />
                ) : (
                  <span className="text-xs text-gray-600">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
