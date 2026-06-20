"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Box,
  BarChart2,
  ShieldCheck,
  Sliders,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/overview", icon: LayoutDashboard, label: "Overview" },
  { href: "/agent", icon: Box, label: "3D Agent" },
  { href: "/market", icon: Activity, label: "Market Feed" },
  { href: "/oversight", icon: ShieldCheck, label: "Oversight" },
  { href: "/simulation", icon: BarChart2, label: "Simulation" },
  { href: "/simulation/config", icon: Sliders, label: "Config" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-gray-900 border-r border-gray-800 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-800">
        <div className="w-7 h-7 rounded-md bg-cyan-500 flex items-center justify-center text-black font-bold text-xs">
          PF
        </div>
        <div className="leading-tight">
          <p className="text-white font-semibold text-sm">PumpFun</p>
          <p className="text-cyan-400 text-[10px] font-medium tracking-widest uppercase">
            3D Agent
          </p>
        </div>
      </div>

      {/* Label */}
      <p className="px-5 pt-5 pb-1 text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
        Navigation
      </p>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Mode badge */}
      <div className="px-5 py-4 border-t border-gray-800">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <div className="leading-tight">
            <p className="text-yellow-400 text-xs font-semibold">Simulation Mode</p>
            <p className="text-gray-500 text-[10px]">No real capital</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
