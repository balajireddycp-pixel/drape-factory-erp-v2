import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import CustomerMaster from "@/pages/customers/CustomerMaster";

/**
 * Each module (Customers, Orders, Production, Dispatch, Inventory,
 * Customer Fabric, Finance, Reports, Settings) adds its own <Route> block
 * here, plus its own service/pages folders — built and reviewed one module
 * at a time per the project workflow. Customer Master is the first one in.
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
        <Route path="/customers" element={<CustomerMaster />} />
      </Route>
    </Routes>
  );
}
