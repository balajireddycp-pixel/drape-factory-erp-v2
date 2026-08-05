import { supabase } from "@/lib/supabaseClient";

/**
 * Aggregate KPI cards: order counts, production in progress, revenue, outstanding, inventory value.
 * Expects a `dashboard_summary` view/RPC in Supabase — see README for the SQL to create it.
 */
export async function fetchDashboardSummary() {
  const { data, error } = await supabase.rpc("get_dashboard_summary");
  if (error) throw error;
  return data;
}

export async function fetchSalesTrend(months = 6) {
  const { data, error } = await supabase.rpc("get_sales_trend", { months_back: months });
  if (error) throw error;
  return data;
}

export async function fetchProductionStageBreakdown() {
  const { data, error } = await supabase
    .from("orders")
    .select("status", { count: "exact" });
  if (error) throw error;

  const counts = {};
  for (const row of data) {
    counts[row.status] = (counts[row.status] || 0) + 1;
  }
  return Object.entries(counts).map(([stage, count]) => ({ stage, count }));
}

export async function fetchRecentOrders(limit = 6) {
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, customer:customers(company), grand_total, status, due_date")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function fetchRecentDispatches(limit = 6) {
  const { data, error } = await supabase
    .from("dispatches")
    .select("id, dispatch_number, order:orders(order_number), vehicle_number, dispatched_at")
    .order("dispatched_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function fetchLowStockAlerts() {
  const { data, error } = await supabase
    .from("materials")
    .select("id, name, stock_qty, min_stock, unit")
    .lte("stock_qty", "min_stock")
    .order("stock_qty", { ascending: true });
  if (error) throw error;
  return data;
}
