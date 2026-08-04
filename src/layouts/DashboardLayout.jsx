import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn("transition-all duration-200", sidebarCollapsed ? "lg:pl-[68px]" : "lg:pl-64")}>
        <Header />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
