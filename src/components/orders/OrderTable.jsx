import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderRowActionsMenu } from "./OrderRowActionsMenu";
import { OrderEmptyState } from "./OrderEmptyState";
import { ORDER_STATUS_TONE } from "@/utils/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

const COLUMNS = ["Order #", "Project", "Customer", "Site Location", "Delivery Date", "Priority", "Status", "Total", ""];

export function OrderTable({ orders, isLoading, onView, onEdit, onDelete, onCreate }) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              {COLUMNS.map((c) => (
                <th key={c} className="px-4 py-2.5 font-medium whitespace-nowrap">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-4 py-3" colSpan={COLUMNS.length}>
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))}

            {!isLoading &&
              orders.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{o.order_number}</td>
                  <td className="px-4 py-3 font-medium">{o.project_name}</td>
                  <td className="px-4 py-3">{o.customer?.company_name || "—"}</td>
                  <td className="px-4 py-3">{o.site_location || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(o.expected_delivery_date)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={o.priority === "Urgent" || o.priority === "High" ? "destructive" : "muted"}>
                      {o.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={ORDER_STATUS_TONE[o.status] || "muted"}>{o.status}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{formatCurrency(o.grand_total)}</td>
                  <td className="px-4 py-3 text-right">
                    <OrderRowActionsMenu onView={() => onView(o)} onEdit={() => onEdit(o)} onDelete={() => onDelete(o)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && orders.length === 0 && (
        <OrderEmptyState
          description="Try adjusting your search or filters, or create your first sales order."
          actionLabel="Create Order"
          onAction={onCreate}
        />
      )}
    </div>
  );
}
