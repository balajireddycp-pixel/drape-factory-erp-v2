import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToastStore } from "@/store/toastStore";
import { cn } from "@/lib/utils";

const ICONS = { success: CheckCircle2, destructive: XCircle, default: Info };
const TONE = {
  success: "border-success/30 bg-success/10 text-success",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
  default: "border-border bg-card text-foreground",
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const Icon = ICONS[t.variant] || Info;
        return (
          <div
            key={t.id}
            className={cn("flex items-start gap-2.5 rounded-lg border px-4 py-3 shadow-lg animate-fade-in", TONE[t.variant])}
          >
            <Icon size={17} className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              {t.title && <p className="text-sm font-medium">{t.title}</p>}
              {t.description && <p className="text-xs opacity-80 mt-0.5">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="opacity-60 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
