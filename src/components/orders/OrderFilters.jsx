import { cn } from "@/lib/utils";
import { ORDER_STATUSES } from "@/utils/constants";

const OPTIONS = ["All", ...ORDER_STATUSES];

export function OrderFilters({ value, onChange }) {
  return (
    <div className="inline-flex flex-wrap items-center gap-0.5 rounded-md border border-border bg-muted p-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-[5px] px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
            value === opt ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
