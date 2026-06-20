"use client";

import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatUsd, formatPct, pnlColor, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from "lucide-react";

export default function PortfolioCard() {
  const { portfolio, stats } = useSimulationStore();

  const metrics = [
    {
      label: "Total Value",
      value: formatUsd(portfolio.totalValueUsd),
      sub: `Started ${formatUsd(portfolio.startingUsd)}`,
      icon: Wallet,
      color: "text-white",
    },
    {
      label: "Total PnL",
      value: formatUsd(portfolio.totalPnlUsd),
      sub: formatPct(portfolio.totalPnlPercent),
      icon: portfolio.totalPnlUsd >= 0 ? TrendingUp : TrendingDown,
      color: pnlColor(portfolio.totalPnlUsd),
    },
    {
      label: "Win Rate",
      value: `${(stats.winRate * 100).toFixed(0)}%`,
      sub: `${stats.winningTrades}W / ${stats.losingTrades}L`,
      icon: BarChart3,
      color: "text-cyan-400",
    },
    {
      label: "Sharpe Ratio",
      value: stats.sharpeRatio.toFixed(2),
      sub: "Risk-adjusted return",
      icon: TrendingUp,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map(({ label, value, sub, icon: Icon, color }) => (
        <div
          key={label}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">{label}</span>
            <Icon size={14} className="text-gray-600" />
          </div>
          <p className={cn("text-xl font-bold", color)}>{value}</p>
          <p className="text-xs text-gray-500">{sub}</p>
        </div>
      ))}
    </div>
  );
}
