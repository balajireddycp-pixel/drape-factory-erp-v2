import { create } from "zustand";

export const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  openMobileSidebar: () => set({ mobileSidebarOpen: true }),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
}));
