import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ title = "No customers found", description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Users size={26} className="text-muted-foreground" />
      </div>
      <div>
        <p className="font-display text-sm font-semibold">{title}</p>
        {description && <p className="mt-1 text-xs text-muted-foreground max-w-xs">{description}</p>}
      </div>
      {actionLabel && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
