import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard";

/**
 * Foundation routing only. Each future module (Customers, Orders, Production,
 * Dispatch, Inventory, Customer Fabric, Finance, Reports, Settings) will add
 * its own <Route> block here, plus its own service/pages folders — built and
 * reviewed one module at a time per the project workflow.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
