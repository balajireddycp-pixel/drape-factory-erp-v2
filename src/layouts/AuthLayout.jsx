import { Outlet } from "react-router-dom";
import { Layers } from "lucide-react";
import { APP_NAME } from "@/utils/constants";

export function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/15">
            <Layers size={18} />
          </div>
          <span className="font-display text-lg font-semibold">{APP_NAME}</span>
        </div>
        <div>
          <h2 className="font-display text-3xl font-semibold leading-tight max-w-md">
            Order to dispatch, every panel tracked.
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/75 max-w-sm">
            Customers, orders, production stages, fabric consumption and finance — one system for the workshop floor.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/50">&copy; {new Date().getFullYear()} {APP_NAME}</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
