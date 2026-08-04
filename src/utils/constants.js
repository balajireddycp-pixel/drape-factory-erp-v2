import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Factory,
  Truck,
  Boxes,
  Scissors,
  Wallet,
  BarChart3,
  Settings,
} from "lucide-react";

export const APP_NAME = import.meta.env.VITE_APP_NAME || "The Drape Factory";

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  PRODUCTION: "production",
  ACCOUNTS: "accounts",
  DISPATCH: "dispatch",
  SALES: "sales",
};

export const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard, roles: "all" },
  { label: "Customers", path: "/customers", icon: Users, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES, ROLES.ACCOUNTS] },
  { label: "Orders", path: "/orders", icon: ShoppingCart, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES] },
  { label: "Production", path: "/production", icon: Factory, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.PRODUCTION] },
  { label: "Dispatch", path: "/dispatch", icon: Truck, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DISPATCH] },
  { label: "Inventory", path: "/inventory", icon: Boxes, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.PRODUCTION] },
  { label: "Customer Fabric", path: "/customer-fabric", icon: Scissors, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.PRODUCTION] },
  { label: "Finance", path: "/finance", icon: Wallet, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.ACCOUNTS] },
  { label: "Reports", path: "/reports", icon: BarChart3, roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { label: "Settings", path: "/settings", icon: Settings, roles: [ROLES.ADMIN] },
];

export const ORDER_STATUSES = [
  "Draft",
  "Received",
  "Production",
  "Ready",
  "Dispatched",
  "Completed",
  "Cancelled",
];

export const ORDER_STATUS_TONE = {
  Draft: "muted",
  Received: "secondary",
  Production: "warning",
  Ready: "accent",
  Dispatched: "primary",
  Completed: "success",
  Cancelled: "destructive",
};

export const PRODUCTION_STAGES = [
  "Received",
  "Cutting",
  "Stitching",
  "Eyelet",
  "Checking",
  "Packing",
  "Ready",
];

export const PRIORITIES = ["Low", "Normal", "High", "Urgent"];
