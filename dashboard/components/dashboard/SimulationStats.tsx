"use client";

import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatUsd, formatPct, formatDuration, pnlColor, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Target, Clock, Award, AlertTriangle } from "lucide-react";

export default function SimulationStats() {
  const { stats } = useSimulationStore();

  const items = [
    {
      label: "Total PnL",
      value: formatUsd(stats.totalPnlUsd),
      sub: formatPct(stats.totalPnlPercent),
      icon: stats.totalPnlUsd >= 0 ? TrendingUp : TrendingDown,
      color: pnlColor(stats.totalPnlUsd),
    },
    {
      label: "Win Rate",
      value: `${(stats.winRate * 100).toFixed(1)}%`,
      sub: `${stats.winningTrades}W / ${stats.losingTrades}L`,
      icon: Target,
      color: "text-cyan-400",
    },
    {
      label: "Sharpe Ratio",
      value: stats.sharpeRatio.toFixed(2),
      sub: "Risk-adjusted",
      icon: Award,
      color: "text-purple-400",
    },
    {
      label: "Max Drawdown",
      value: `-${stats.maxDrawdownPercent.toFixed(2)}%`,
      sub: "Peak to trough",
      icon: AlertTriangle,
      color: "text-yellow-400",
    },
    {
      label: "Best Trade",
      value: formatUsd(stats.bestTradeUsd),
      sub: "Single trade",
      icon: TrendingUp,
      color: "text-green-400",
    },
    {
      label: "Worst Trade",
      value: formatUsd(stats.worstTradeUsd),
      sub: "Single trade",
      icon: TrendingDown,
      color: "text-red-400",
    },
    {
      label: "Avg Return",
      value: formatPct(stats.avgTradeReturnPercent),
      sub: "Per trade",
      icon: BarChart,
      color: stats.avgTradeReturnPercent >= 0 ? "text-green-400" : "text-red-400",
    },
    {
      label: "Avg Hold Time",
      value: formatDuration(stats.avgHoldTimeSeconds),
      sub: "Per position",
      icon: Clock,
      color: "text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map(({ label, value, sub, icon: Icon, color }) => (
        <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">{label}</span>
            <Icon size={13} className="text-gray-600" />
          </div>
          <p className={cn("text-xl font-bold", color)}>{value}</p>
          <p className="text-xs text-gray-500 mt-1">{sub}</p>
        </div>
      ))}
    </div>
  );
}

// Fallback icon since recharts doesn't export one
function BarChart({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
