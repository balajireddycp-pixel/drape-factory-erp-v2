import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, icon: Icon, trend, loading, tone = "primary" }) {
  const toneClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            {loading ? (
              <Skeleton className="mt-2 h-7 w-20" />
            ) : (
              <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
            )}
            {trend && !loading && (
              <p className={cn("mt-1 text-xs font-medium", trend.positive ? "text-success" : "text-destructive")}>
                {trend.positive ? "▲" : "▼"} {trend.label}
              </p>
            )}
          </div>
          {Icon && (
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-md", toneClasses[tone])}>
              <Icon size={18} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
