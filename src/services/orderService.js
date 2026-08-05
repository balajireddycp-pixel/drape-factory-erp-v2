import { supabase } from "@/lib/supabaseClient";

const ORDERS_TABLE = "sales_orders";
const ITEMS_TABLE = "sales_order_items";
const CODE_PREFIX = "SO-";
const CODE_PAD = 5;

function nextCodeFrom(lastCode) {
  const n = lastCode ? parseInt(lastCode.replace(CODE_PREFIX, ""), 10) || 0 : 0;
  return `${CODE_PREFIX}${String(n + 1).padStart(CODE_PAD, "0")}`;
}

async function generateOrderNumber() {
  const { data, error } = await supabase
    .from(ORDERS_TABLE)
    .select("order_number")
    .order("order_number", { ascending: false })
    .limit(1);
  if (error) throw error;
  return nextCodeFrom(data?.[0]?.order_number);
}

function computeItemAmount(item) {
  return Number(item.quantity || 0) * Number(item.unit_price || 0);
}

function computeTotals(items) {
  const grand_total = items.reduce((sum, item) => sum + computeItemAmount(item), 0);
  return { subtotal: grand_total, grand_total };
}

/**
 * List orders with optional search + status filter. Includes the linked
 * customer's company name for display in the table.
 */
export async function getOrders({ search = "", status = "All" } = {}) {
  let query = supabase
    .from(ORDERS_TABLE)
    .select("*, customer:customers(id, company_name, customer_code)")
    .order("created_at", { ascending: false });

  if (status && status !== "All") {
    query = query.eq("status", status);
  }

  if (search?.trim()) {
    const term = search.trim();
    query = query.or(
      [`order_number.ilike.%${term}%`, `project_name.ilike.%${term}%`, `site_location.ilike.%${term}%`].join(",")
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getOrderById(id) {
  const { data, error } = await supabase
    .from(ORDERS_TABLE)
    .select("*, customer:customers(id, company_name, customer_code), items:sales_order_items(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createOrder({ items, ...order }) {
  const order_number = await generateOrderNumber();
  const totals = computeTotals(items);

  const { data: created, error: orderError } = await supabase
    .from(ORDERS_TABLE)
    .insert([{ ...order, order_number, ...totals }])
    .select()
    .single();
  if (orderError) throw orderError;

  const itemRows = items.map((item) => ({
    ...item,
    sales_order_id: created.id,
    amount: computeItemAmount(item),
  }));
  const { error: itemsError } = await supabase.from(ITEMS_TABLE).insert(itemRows);
  if (itemsError) throw itemsError;

  return created;
}

export async function updateOrder(id, { items, ...order }) {
  const totals = computeTotals(items);

  const { data: updated, error: orderError } = await supabase
    .from(ORDERS_TABLE)
    .update({ ...order, ...totals })
    .eq("id", id)
    .select()
    .single();
  if (orderError) throw orderError;

  // Simplest consistent strategy for a line-item child table: replace all items.
  const { error: deleteError } = await supabase.from(ITEMS_TABLE).delete().eq("sales_order_id", id);
  if (deleteError) throw deleteError;

  const itemRows = items.map((item) => ({
    ...item,
    sales_order_id: id,
    amount: computeItemAmount(item),
  }));
  const { error: itemsError } = await supabase.from(ITEMS_TABLE).insert(itemRows);
  if (itemsError) throw itemsError;

  return updated;
}

export async function deleteOrder(id) {
  const { error } = await supabase.from(ORDERS_TABLE).delete().eq("id", id);
  if (error) throw error;
  return true;
}
