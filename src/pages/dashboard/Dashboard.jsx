import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Factory, Wallet, AlertCircle } from "lucide-react";
import {
  fetchDashboardSummary,
  fetchSalesTrend,
  fetchProductionStageBreakdown,
  fetchRecentOrders,
  fetchLowStockAlerts,
} from "@/services/dashboardService";
import { StatCard } from "./components/StatCard";
import { SalesTrendChart } from "./components/SalesTrendChart";
import { ProductionStageChart } from "./components/ProductionStageChart";
import { RecentOrdersTable } from "./components/RecentOrdersTable";
import { AlertsPanel } from "./components/AlertsPanel";
import { formatCurrency } from "@/lib/utils";

export default function Dashboard() {
  const summary = useQuery({ queryKey: ["dashboard-summary"], queryFn: fetchDashboardSummary });
  const trend = useQuery({ queryKey: ["sales-trend"], queryFn: () => fetchSalesTrend(6) });
  const stages = useQuery({ queryKey: ["production-stages"], queryFn: fetchProductionStageBreakdown });
  const recentOrders = useQuery({ queryKey: ["recent-orders"], queryFn: () => fetchRecentOrders(6) });
  const alerts = useQuery({ queryKey: ["low-stock"], queryFn: fetchLowStockAlerts });

  const s = summary.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Live snapshot of orders, production, and finance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open orders" value={s?.open_orders ?? "—"} icon={ShoppingCart} tone="primary" loading={summary.isLoading} />
        <StatCard label="In production" value={s?.in_production ?? "—"} icon={Factory} tone="warning" loading={summary.isLoading} />
        <StatCard
          label="Revenue (MTD)"
          value={s ? formatCurrency(s.revenue_mtd) : "—"}
          icon={Wallet}
          tone="success"
          loading={summary.isLoading}
        />
        <StatCard
          label="Outstanding"
          value={s ? formatCurrency(s.outstanding) : "—"}
          icon={AlertCircle}
          tone="destructive"
          loading={summary.isLoading}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SalesTrendChart data={trend.data} loading={trend.isLoading} />
        </div>
        <ProductionStageChart data={stages.data} loading={stages.isLoading} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={recentOrders.data} loading={recentOrders.isLoading} />
        </div>
        <AlertsPanel alerts={alerts.data} loading={alerts.isLoading} />
      </div>
    </div>
  );
}
