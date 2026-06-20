"use client";

import { useSimulationStore } from "@/lib/store/simulationStore";
import { formatUsd } from "@/lib/utils";
import { Settings } from "lucide-react";

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-500"
      />
    </div>
  );
}

export default function SimulationConfigPage() {
  const { config, updateConfig } = useSimulationStore();

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Settings size={18} className="text-cyan-400" />
        <h1 className="text-lg font-bold text-white">Simulation Config</h1>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        <Slider
          label="Starting Capital"
          value={config.startingCapitalUsd}
          min={100}
          max={10000}
          step={100}
          format={(v) => formatUsd(v, 0)}
          onChange={(v) => updateConfig({ startingCapitalUsd: v })}
        />
        <Slider
          label="Max Position Size"
          value={config.maxPositionSizePercent}
          min={1}
          max={25}
          step={1}
          format={(v) => `${v}% of portfolio`}
          onChange={(v) => updateConfig({ maxPositionSizePercent: v })}
        />
        <Slider
          label="Max Concurrent Positions"
          value={config.maxConcurrentPositions}
          min={1}
          max={10}
          step={1}
          format={(v) => `${v}`}
          onChange={(v) => updateConfig({ maxConcurrentPositions: v })}
        />
        <Slider
          label="Min AI Confidence"
          value={config.minConfidence}
          min={0.5}
          max={0.95}
          step={0.05}
          format={(v) => `${(v * 100).toFixed(0)}%`}
          onChange={(v) => updateConfig({ minConfidence: v })}
        />
        <Slider
          label="Stop Loss"
          value={config.stopLossPercent}
          min={5}
          max={50}
          step={5}
          format={(v) => `-${v}%`}
          onChange={(v) => updateConfig({ stopLossPercent: v })}
        />
        <Slider
          label="Take Profit"
          value={config.takeProfitPercent}
          min={10}
          max={200}
          step={10}
          format={(v) => `+${v}%`}
          onChange={(v) => updateConfig({ takeProfitPercent: v })}
        />
        <Slider
          label="Approval Timeout"
          value={config.approvalTimeoutSeconds}
          min={30}
          max={300}
          step={30}
          format={(v) => `${v}s`}
          onChange={(v) => updateConfig({ approvalTimeoutSeconds: v })}
        />

        {/* Human approval toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <div>
            <p className="text-sm text-white font-medium">Require Human Approval</p>
            <p className="text-xs text-gray-500 mt-0.5">
              When enabled, every agent trade requires manual approval before simulation
            </p>
          </div>
          <button
            onClick={() => updateConfig({ requireHumanApproval: !config.requireHumanApproval })}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              config.requireHumanApproval ? "bg-cyan-500" : "bg-gray-700"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                config.requireHumanApproval ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-600 text-center">
        Changes apply to new simulation trades only. Reset the simulation to start fresh.
      </p>
    </div>
  );
}
