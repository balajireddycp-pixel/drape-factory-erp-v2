import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RowActionsMenu } from "./RowActionsMenu";
import { EmptyState } from "./EmptyState";

const COLUMNS = ["Customer Code", "Company Name", "Contact Person", "Mobile", "City", "Credit Days", "Status", ""];

export function CustomerTable({ customers, isLoading, onView, onEdit, onDelete, onCreate }) {
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
              customers.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{c.customer_code}</td>
                  <td className="px-4 py-3 font-medium">{c.company_name}</td>
                  <td className="px-4 py-3">{c.contact_person || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{c.mobile || "—"}</td>
                  <td className="px-4 py-3">{c.city || "—"}</td>
                  <td className="px-4 py-3">{c.credit_days ?? 0} days</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.status === "Active" ? "success" : "muted"}>{c.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RowActionsMenu
                      onView={() => onView(c)}
                      onEdit={() => onEdit(c)}
                      onDelete={() => onDelete(c)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && customers.length === 0 && (
        <EmptyState
          description="Try adjusting your search or filters, or add your first customer."
          actionLabel="Create Customer"
          onAction={onCreate}
        />
      )}
    </div>
  );
}
