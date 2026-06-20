import PortfolioCard from "@/components/dashboard/PortfolioCard";
import PnLChart from "@/components/dashboard/PnLChart";
import TradeHistory from "@/components/dashboard/TradeHistory";
import MarketFeed from "@/components/dashboard/MarketFeed";
import AgentStatusCard from "@/components/dashboard/AgentStatusCard";
import PositionsTable from "@/components/dashboard/PositionsTable";

export const metadata = {
  title: "Overview | PumpFun 3D Agent",
};

export default function OverviewPage() {
  return (
    <div className="space-y-4 max-w-screen-2xl mx-auto">
      {/* Top metrics */}
      <PortfolioCard />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: chart + trades */}
        <div className="lg:col-span-2 space-y-4">
          <PnLChart />
          <PositionsTable />
          <TradeHistory />
        </div>

        {/* Right: agent + market */}
        <div className="space-y-4">
          <AgentStatusCard />
          <MarketFeed />
        </div>
      </div>
    </div>
  );
}
