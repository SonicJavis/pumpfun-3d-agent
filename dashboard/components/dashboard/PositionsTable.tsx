"use client";

import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatUsd, formatPct, pnlColor, cn } from "@/lib/utils";

export default function PositionsTable() {
  const { portfolio } = useSimulationStore();

  if (portfolio.positions.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
        <p className="text-gray-500 text-sm">No open positions</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-white">Open Positions</h3>
        <span className="text-xs text-gray-500">{portfolio.positions.length} active</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-800">
              <th className="text-left px-4 py-2 font-medium">Token</th>
              <th className="text-right px-4 py-2 font-medium">Entry</th>
              <th className="text-right px-4 py-2 font-medium">Current</th>
              <th className="text-right px-4 py-2 font-medium">Value</th>
              <th className="text-right px-4 py-2 font-medium">Unrealized PnL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {portfolio.positions.map((pos) => (
              <tr key={pos.tokenMint} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-white">{pos.tokenSymbol}</p>
                    <p className="text-xs text-gray-500">{pos.tokenName}</p>
                  </div>
                </td>
                <td className="text-right px-4 py-3 text-gray-400 text-xs">
                  ${pos.entryPrice.toFixed(6)}
                </td>
                <td className="text-right px-4 py-3 text-gray-300 text-xs">
                  ${pos.currentPrice.toFixed(6)}
                </td>
                <td className="text-right px-4 py-3 text-white">
                  {formatUsd(pos.currentValueUsd)}
                </td>
                <td className="text-right px-4 py-3">
                  <div>
                    <p className={cn("font-medium", pnlColor(pos.unrealizedPnlUsd))}>
                      {formatUsd(pos.unrealizedPnlUsd)}
                    </p>
                    <p className={cn("text-xs", pnlColor(pos.unrealizedPnlPercent))}>
                      {formatPct(pos.unrealizedPnlPercent)}
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
