# The Drape Factory — ERP (Foundation)

Production foundation for the ERP: project scaffold, theming (light/dark), auth (Supabase),
protected routing, app shell (sidebar/header), and a live Dashboard page. Customers, Orders,
Production, Dispatch, Inventory, Customer Fabric, Finance, Reports and Settings are **not**
built yet — each is a separate module, built and reviewed one at a time, per the project workflow.

## 1. Install

```bash
npm install
```

## 2. Configure Supabase

```bash
cp .env.example .env.local
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase project settings
(Project Settings → API).

## 3. Required schema (this foundation reuses your existing DB — create only what's missing)

The Dashboard queries the following tables/columns. If your existing schema uses different
names, either rename here (`src/services/dashboardService.js`) or add views that match:

- `profiles (id uuid references auth.users, full_name text, role text, avatar_url text, is_active boolean)`
- `customers (id, company text)`
- `orders (id, order_number text, customer_id, status text, grand_total numeric, due_date date, created_at timestamptz)`
- `dispatches (id, dispatch_number text, order_id, vehicle_number text, dispatched_at timestamptz)`
- `materials (id, name text, stock_qty numeric, min_stock numeric, unit text)`

`role` should be one of: `admin`, `manager`, `production`, `accounts`, `dispatch`, `sales`
(see `src/utils/constants.js` → `ROLES`).

### RPC functions used by the dashboard

Create these in the Supabase SQL editor (adjust table/column names to match your schema):

```sql
create or replace function get_dashboard_summary()
returns table (
  open_orders bigint,
  in_production bigint,
  revenue_mtd numeric,
  outstanding numeric
)
language sql
as $$
  select
    (select count(*) from orders where status not in ('Completed', 'Cancelled')),
    (select count(*) from orders where status = 'Production'),
    (select coalesce(sum(grand_total), 0) from orders
       where date_trunc('month', created_at) = date_trunc('month', now())),
    (select coalesce(sum(grand_total), 0) from orders where status != 'Completed');
$$;

create or replace function get_sales_trend(months_back int default 6)
returns table (month text, revenue numeric)
language sql
as $$
  select to_char(date_trunc('month', created_at), 'Mon') as month,
         coalesce(sum(grand_total), 0) as revenue
  from orders
  where created_at >= date_trunc('month', now()) - (months_back || ' months')::interval
  group by date_trunc('month', created_at)
  order by date_trunc('month', created_at);
$$;
```

Enable Row Level Security on every table and add policies scoped by `auth.uid()` / role before
going live — the anon key alone must not expose data.

## 4. Run

```bash
npm run dev
```

Visit `http://localhost:5173`. You'll land on `/login` until a session exists.

## 5. Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/   ui primitives (button, card, badge…), layout (sidebar, header), auth
  pages/        route-level pages, grouped by module
  layouts/      DashboardLayout, AuthLayout
  contexts/     AuthContext, ThemeContext
  store/        zustand UI state (sidebar collapse, mobile drawer)
  hooks/        useAuth
  services/     Supabase query functions, one file per module
  lib/          supabaseClient, cn()/formatCurrency()/formatDate() utils
  utils/        constants (nav items, statuses, roles)
  routes/       route table
```

Rule going forward: max ~300 lines per file, one concern per file, no logic duplication —
shared logic goes in `hooks/` or `services/`.

## Git commit for this step

```
feat(foundation): project scaffold, theme, auth, protected routing, app shell, live dashboard
```

## Next step

Customer module (list, create/edit form with GST/PAN validation, credit limit & outstanding,
view orders/invoices) — waiting for approval before starting.
