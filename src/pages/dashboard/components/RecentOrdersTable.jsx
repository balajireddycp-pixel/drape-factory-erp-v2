import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ORDER_STATUS_TONE } from "@/utils/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

export function RecentOrdersTable({ orders, loading }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent orders</CardTitle>
        <CardDescription>Latest orders placed across all customers</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-2 font-medium">Order #</th>
                <th className="px-5 py-2 font-medium">Customer</th>
                <th className="px-5 py-2 font-medium">Due</th>
                <th className="px-5 py-2 font-medium">Status</th>
                <th className="px-5 py-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-5 py-3" colSpan={5}><Skeleton className="h-4 w-full" /></td>
                  </tr>
                ))}
              {!loading && orders?.length === 0 && (
                <tr><td className="px-5 py-6 text-center text-muted-foreground" colSpan={5}>No orders yet.</td></tr>
              )}
              {!loading &&
                orders?.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-5 py-3 font-medium">
                      <Link to={`/orders/${o.id}`} className="hover:text-primary">{o.order_number}</Link>
                    </td>
                    <td className="px-5 py-3">{o.customer?.company || "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground">{formatDate(o.due_date)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={ORDER_STATUS_TONE[o.status] || "muted"}>{o.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right font-medium">{formatCurrency(o.grand_total)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
