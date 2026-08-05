import { create } from "zustand";

let idCounter = 0;

export const useToastStore = create((set) => ({
  toasts: [],
  push: (toast) =>
    set((s) => {
      const id = ++idCounter;
      const item = { id, variant: "default", duration: 4000, ...toast };
      setTimeout(() => {
        set((s2) => ({ toasts: s2.toasts.filter((t) => t.id !== id) }));
      }, item.duration);
      return { toasts: [...s.toasts, item] };
    }),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast({ title, description, variant = "default" }) {
  useToastStore.getState().push({ title, description, variant });
}

toast.success = (title, description) => toast({ title, description, variant: "success" });
toast.error = (title, description) => toast({ title, description, variant: "destructive" });
