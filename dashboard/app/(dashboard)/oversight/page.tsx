import PendingDecisions from "@/components/oversight/PendingDecisions";
import OversightPanel from "@/components/oversight/OversightPanel";
import TradeHistory from "@/components/dashboard/TradeHistory";

export const metadata = { title: "Oversight | PumpFun 3D Agent" };

export default function OversightPage() {
  return (
    <div className="max-w-screen-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-bold text-white">Human Oversight</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Review and approve/reject every trade the agent wants to execute
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Pending Decisions
            </h2>
            <PendingDecisions />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Decision History
            </h2>
            <TradeHistory />
          </div>
        </div>
        <div>
          <OversightPanel />
        </div>
      </div>
    </div>
  );
}
