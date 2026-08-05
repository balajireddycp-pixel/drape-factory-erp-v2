import { cn } from "@/lib/utils";

const OPTIONS = ["All", "Active", "Inactive"];

export function CustomerFilters({ value, onChange }) {
  return (
    <div className="inline-flex items-center rounded-md border border-border bg-muted p-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-[5px] px-3 py-1.5 text-xs font-medium transition-colors",
            value === opt ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
