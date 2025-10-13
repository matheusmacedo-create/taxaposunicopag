import { MetricsDisplay } from "@/components/dashboard/MetricsDisplay";
import { RecentProposals } from "@/components/dashboard/RecentProposals";

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-unicopag-black mb-6">Dashboard de Vendas</h1>

      <MetricsDisplay />
      <RecentProposals />
    </div>
  );
};

export default Dashboard;