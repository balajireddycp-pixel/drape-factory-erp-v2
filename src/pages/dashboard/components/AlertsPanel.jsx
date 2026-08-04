import { AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function AlertsPanel({ alerts, loading }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle size={15} className="text-warning" /> Inventory alerts
        </CardTitle>
        <CardDescription>Materials at or below minimum stock</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
        {!loading && alerts?.length === 0 && (
          <p className="text-sm text-muted-foreground">All materials are above minimum stock.</p>
        )}
        {!loading &&
          alerts?.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <span className="text-sm font-medium">{a.name}</span>
              <Badge variant="destructive">{a.stock_qty} {a.unit} left</Badge>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
