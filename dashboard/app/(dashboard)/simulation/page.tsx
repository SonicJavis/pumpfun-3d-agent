import SimulationStats from "@/components/dashboard/SimulationStats";
import PnLChart from "@/components/dashboard/PnLChart";
import TradeHistory from "@/components/dashboard/TradeHistory";
import PositionsTable from "@/components/dashboard/PositionsTable";

export const metadata = { title: "Simulation | PumpFun 3D Agent" };

export default function SimulationPage() {
  return (
    <div className="max-w-screen-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Simulation</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Full performance analytics for the paper trading simulation
        </p>
      </div>
      <SimulationStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PnLChart />
        <PositionsTable />
      </div>
      <TradeHistory />
    </div>
  );
}
