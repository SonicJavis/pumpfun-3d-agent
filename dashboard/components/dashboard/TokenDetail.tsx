"use client";

import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatUsd, formatPct, formatNumber, formatRelativeTime, pnlColor, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Users, BarChart2, Zap, ExternalLink } from "lucide-react";

export default function TokenDetail() {
  const { selectedToken } = useSimulationStore();

  if (!selectedToken) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center p-12">
        <p className="text-gray-500 text-sm">Select a token from the feed</p>
      </div>
    );
  }

  const t = selectedToken;
  const isUp24 = t.priceChange24h >= 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-lg font-bold text-gray-200">
            {t.symbol.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{t.symbol}</h2>
              {t.isGraduated && (
                <span className="text-xs text-purple-400 border border-purple-400/30 px-1.5 py-0.5 rounded">GRADUATED</span>
              )}
            </div>
            <p className="text-sm text-gray-400">{t.name}</p>
          </div>
        </div>
        <a
          href={`https://pump.fun/coin/${t.mint}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white transition-colors"
        >
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Price */}
      <div className="p-3 bg-gray-800 rounded-xl">
        <p className="text-xs text-gray-500 mb-1">Price (USD)</p>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-white">${t.priceUsd.toFixed(8)}</span>
          <span className={cn("text-sm font-medium flex items-center gap-0.5 mb-0.5", pnlColor(t.priceChange24h))}>
            {isUp24 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {formatPct(t.priceChange24h)} 24h
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-[10px] text-gray-500 mb-1 flex items-center gap-1"><BarChart2 size={9} /> Market Cap</p>
          <p className="text-sm font-semibold text-white">{formatUsd(t.marketCap, 0)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-[10px] text-gray-500 mb-1 flex items-center gap-1"><Zap size={9} /> Volume 24h</p>
          <p className="text-sm font-semibold text-white">{formatUsd(t.volume24h, 0)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-[10px] text-gray-500 mb-1 flex items-center gap-1"><Users size={9} /> Holders</p>
          <p className="text-sm font-semibold text-white">{formatNumber(t.holders)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-[10px] text-gray-500 mb-1">Created</p>
          <p className="text-sm font-semibold text-white">{formatRelativeTime(t.createdAt)}</p>
        </div>
      </div>

      {/* Bonding curve */}
      <div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-400">Bonding Curve Progress</span>
          <span className="text-white font-medium">{t.bondingCurveProgress}%</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              t.bondingCurveProgress >= 80 ? "bg-purple-500" :
              t.bondingCurveProgress >= 50 ? "bg-cyan-500" : "bg-blue-500"
            )}
            style={{ width: `${t.bondingCurveProgress}%` }}
          />
        </div>
        {t.bondingCurveProgress >= 80 && !t.isGraduated && (
          <p className="text-xs text-purple-400 mt-1 flex items-center gap-1">
            <Zap size={10} /> Near graduation — high momentum signal
          </p>
        )}
      </div>

      {/* Description */}
      {t.description && (
        <div className="p-3 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-400">{t.description}</p>
        </div>
      )}

      {/* Mint address */}
      <div>
        <p className="text-[10px] text-gray-600 mb-1">Mint Address</p>
        <p className="text-[10px] font-mono text-gray-500 break-all">{t.mint}</p>
      </div>
    </div>
  );
}
