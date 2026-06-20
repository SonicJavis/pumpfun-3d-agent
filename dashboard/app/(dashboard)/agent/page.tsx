"use client";

import dynamic from "next/dynamic";
import { useSimulationStore } from "@/lib/store/simulationStore";
import AgentStatusCard from "@/components/dashboard/AgentStatusCard";
import { cn } from "@/lib/utils";

// Dynamic import — Three.js is client-only
const AgentScene = dynamic(() => import("@/components/3d/AgentScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-xl">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Loading 3D scene…</p>
      </div>
    </div>
  ),
});

const STATUS_LABELS: Record<string, string> = {
  idle: "Agent Idle",
  scanning: "Scanning Market",
  evaluating: "Evaluating Signal",
  waiting_approval: "Awaiting Human Approval",
  executing: "Executing Simulation",
  paused: "Agent Paused",
};

const STATUS_COLORS: Record<string, string> = {
  idle: "text-gray-400",
  scanning: "text-cyan-400",
  evaluating: "text-blue-400",
  waiting_approval: "text-yellow-400",
  executing: "text-green-400",
  paused: "text-gray-500",
};

export default function AgentPage() {
  const { agent } = useSimulationStore();

  return (
    <div className="max-w-screen-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">3D Agent Visualizer</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Real-time 3D visualization of the AI trading agent state
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 3D Viewport */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden" style={{ height: 520 }}>
            {/* Status overlay */}
            <div className="absolute z-10 m-4 flex items-center gap-2 bg-gray-900/80 backdrop-blur border border-gray-800 rounded-lg px-3 py-1.5">
              <span className={cn("w-2 h-2 rounded-full animate-pulse", {
                "bg-cyan-400": agent.status === "scanning",
                "bg-blue-400": agent.status === "evaluating",
                "bg-yellow-400": agent.status === "waiting_approval",
                "bg-green-400": agent.status === "executing",
                "bg-gray-400": agent.status === "idle" || agent.status === "paused",
              })} />
              <span className={cn("text-xs font-medium", STATUS_COLORS[agent.status])}>
                {STATUS_LABELS[agent.status]}
              </span>
              <span className="text-gray-600 text-xs">·</span>
              <span className="text-gray-400 text-xs">
                {(agent.confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
            <AgentScene status={agent.status} confidence={agent.confidence} />
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            Three.js WebGL visualization — icosahedron core with orbiting data rings and particle nodes
          </p>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <AgentStatusCard />

          {/* Legend */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Color Legend</h3>
            <div className="space-y-2">
              {[
                { label: "Scanning Market", color: "bg-cyan-400" },
                { label: "Evaluating Signal", color: "bg-blue-400" },
                { label: "Awaiting Approval", color: "bg-yellow-400" },
                { label: "Executing Trade", color: "bg-green-400" },
                { label: "Paused / Idle", color: "bg-gray-500" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", color)} />
                  <span className="text-xs text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech note */}
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
            <p className="text-xs text-blue-400 font-medium mb-1">3D Engine</p>
            <p className="text-xs text-gray-400">
              Built with Three.js (WebGL). The core icosahedron pulses at a rate
              proportional to the agent&apos;s current confidence score. Orbiting
              rings represent active data streams. Floating nodes are scanned tokens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
