"use client";

import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatUsd, formatPct, formatRelativeTime, formatNumber, pnlColor, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Zap, ExternalLink } from "lucide-react";

export default function MarketFeed() {
  const { tokens, selectedToken, setSelectedToken } = useSimulationStore();

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-white">Market Feed</h3>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-500">Live (simulated)</span>
        </div>
      </div>
      <div className="divide-y divide-gray-800">
        {tokens.map((token) => {
          const isSelected = selectedToken?.mint === token.mint;
          const isUp = token.priceChange1h >= 0;
          return (
            <button
              key={token.mint}
              onClick={() => setSelectedToken(token)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                isSelected ? "bg-cyan-500/5 border-l-2 border-cyan-400" : "hover:bg-gray-800/50"
              )}
            >
              {/* Token avatar */}
              <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 shrink-0">
                {token.symbol.slice(0, 2)}
              </div>

              {/* Name + bonding */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-white">{token.symbol}</span>
                  {token.isGraduated && (
                    <span className="text-[10px] text-purple-400 border border-purple-400/30 px-1 rounded">GRAD</span>
                  )}
                  {token.priceChange1h > 50 && (
                    <Zap size={10} className="text-yellow-400" />
                  )}
                </div>
                {/* Bonding curve bar */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${token.bondingCurveProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500">{token.bondingCurveProgress}%</span>
                </div>
              </div>

              {/* Market cap */}
              <div className="text-right shrink-0">
                <p className="text-xs text-white">{formatUsd(token.marketCap, 0)}</p>
                <p className="text-[10px] text-gray-500">{formatRelativeTime(token.createdAt)}</p>
              </div>

              {/* 1h change */}
              <div className={cn("flex items-center gap-0.5 text-xs font-medium shrink-0 w-14 justify-end", pnlColor(token.priceChange1h))}>
                {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {formatPct(token.priceChange1h)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
