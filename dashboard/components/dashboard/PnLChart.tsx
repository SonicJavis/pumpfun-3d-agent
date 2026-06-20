"use client";

import { useSimulationStore } from "@/lib/store/simulationStore";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number; payload: { timestamp: number } }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400">
        {format(new Date(p.payload.timestamp), "MMM d, HH:mm")}
      </p>
      <p className="text-white font-semibold">${p.value.toFixed(2)}</p>
    </div>
  );
}

export default function PnLChart() {
  const { equityCurve, portfolio } = useSimulationStore();

  const data = equityCurve.map((p) => ({
    timestamp: p.timestamp,
    value: p.valueUsd,
    label: format(new Date(p.timestamp), "HH:mm"),
  }));

  const isPositive = portfolio.totalPnlUsd >= 0;
  const strokeColor = isPositive ? "#22c55e" : "#ef4444";
  const fillColor = isPositive ? "#22c55e" : "#ef4444";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Equity Curve (24h)</h3>
        <span className="text-xs text-gray-500">Simulated capital</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fillColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            interval={7}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${v.toFixed(0)}`}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={portfolio.startingUsd}
            stroke="#374151"
            strokeDasharray="4 4"
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2}
            fill="url(#colorValue)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
