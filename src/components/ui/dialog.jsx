import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onOpenChange(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 pt-10 sm:pt-16">
      <div className="fixed inset-0 bg-black/60 animate-fade-in" onClick={() => onOpenChange(false)} />
      {children}
    </div>
  );
}

export function DialogContent({ className, children, size = "md" }) {
  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-3xl" };
  return (
    <div
      className={cn(
        "relative z-10 w-full rounded-lg border border-border bg-card text-card-foreground shadow-xl animate-fade-in",
        sizes[size],
        className
      )}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ className, children, onClose }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 border-b border-border px-6 py-4", className)}>
      <div>{children}</div>
      {onClose && (
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export function DialogTitle({ className, ...props }) {
  return <h2 className={cn("font-display text-base font-semibold", className)} {...props} />;
}

export function DialogDescription({ className, ...props }) {
  return <p className={cn("mt-0.5 text-xs text-muted-foreground", className)} {...props} />;
}

export function DialogBody({ className, ...props }) {
  return <div className={cn("max-h-[65vh] overflow-y-auto px-6 py-4", className)} {...props} />;
}

export function DialogFooter({ className, ...props }) {
  return <div className={cn("flex items-center justify-end gap-2 border-t border-border px-6 py-4", className)} {...props} />;
}
