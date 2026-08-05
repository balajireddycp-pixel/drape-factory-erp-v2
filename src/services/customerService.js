import { supabase } from "@/lib/supabaseClient";

const TABLE = "customers";
const CODE_PREFIX = "CUS-";
const CODE_PAD = 5;

function nextCodeFrom(lastCode) {
  const n = lastCode ? parseInt(lastCode.replace(CODE_PREFIX, ""), 10) || 0 : 0;
  return `${CODE_PREFIX}${String(n + 1).padStart(CODE_PAD, "0")}`;
}

async function generateCustomerCode() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("customer_code")
    .order("customer_code", { ascending: false })
    .limit(1);
  if (error) throw error;
  return nextCodeFrom(data?.[0]?.customer_code);
}

/**
 * List customers with optional search + status filter.
 * @param {{ search?: string, status?: 'Active'|'Inactive'|'All' }} params
 */
export async function getCustomers({ search = "", status = "All" } = {}) {
  let query = supabase.from(TABLE).select("*").order("created_at", { ascending: false });

  if (status && status !== "All") {
    query = query.eq("status", status);
  }

  if (search?.trim()) {
    const term = search.trim();
    query = query.or(
      [
        `customer_code.ilike.%${term}%`,
        `company_name.ilike.%${term}%`,
        `contact_person.ilike.%${term}%`,
        `mobile.ilike.%${term}%`,
        `city.ilike.%${term}%`,
      ].join(",")
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Kept as a distinct export per the requested service shape; delegates to getCustomers.
export async function searchCustomers(term, status = "All") {
  return getCustomers({ search: term, status });
}

export async function getCustomerById(id) {
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createCustomer(payload) {
  const customer_code = await generateCustomerCode();
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ ...payload, customer_code }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCustomer(id, payload) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCustomer(id) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
  return true;
}
