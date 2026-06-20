import MarketFeed from "@/components/dashboard/MarketFeed";
import TokenDetail from "@/components/dashboard/TokenDetail";

export const metadata = { title: "Market Feed | PumpFun 3D Agent" };

export default function MarketPage() {
  return (
    <div className="max-w-screen-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Market Feed</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Simulated pump.fun token stream — agent watches these in real time
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MarketFeed />
        <TokenDetail />
      </div>
    </div>
  );
}
