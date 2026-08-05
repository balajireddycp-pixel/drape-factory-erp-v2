import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOrderById } from "@/services/orderService";
import { ORDER_STATUS_TONE } from "@/utils/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

function Row({ label, value }) {
  return (
    <div className="py-2 border-b border-border last:border-0 grid grid-cols-3 gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="col-span-2 text-sm break-words">{value || "—"}</span>
    </div>
  );
}

export function OrderView({ open, onOpenChange, order, onEdit }) {
  const { data: fullOrder, isLoading } = useQuery({
    queryKey: ["order-detail", order?.id],
    queryFn: () => getOrderById(order.id),
    enabled: open && Boolean(order?.id),
  });

  if (!order) return null;
  const o = fullOrder || order;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl">
        <DialogHeader onClose={() => onOpenChange(false)}>
          <DialogTitle>{o.project_name}</DialogTitle>
          <DialogDescription>{o.order_number} · {o.customer?.company_name}</DialogDescription>
        </DialogHeader>

        <DialogBody>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground text-sm gap-2">
              <Loader2 size={16} className="animate-spin" /> Loading order…
            </div>
          ) : (
            <>
              <div className="mb-3 flex gap-2">
                <Badge variant={ORDER_STATUS_TONE[o.status] || "muted"}>{o.status}</Badge>
                <Badge variant={o.priority === "Urgent" || o.priority === "High" ? "destructive" : "muted"}>
                  {o.priority} priority
                </Badge>
              </div>

              <Row label="Customer" value={o.customer?.company_name} />
              <Row label="Site Location" value={o.site_location} />
              <Row label="Expected Delivery" value={formatDate(o.expected_delivery_date)} />
              <Row label="Remarks" value={o.remarks} />
              <Row label="Created" value={formatDate(o.created_at)} />

              <p className="mt-5 mb-2 text-sm font-medium">Order Items</p>
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Room</th>
                      <th className="px-3 py-2 font-medium">Product</th>
                      <th className="px-3 py-2 font-medium">W × H</th>
                      <th className="px-3 py-2 font-medium">Qty</th>
                      <th className="px-3 py-2 font-medium">Stitching</th>
                      <th className="px-3 py-2 font-medium">Lining</th>
                      <th className="px-3 py-2 font-medium">Hardware</th>
                      <th className="px-3 py-2 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(o.items || []).map((item) => (
                      <tr key={item.id} className="border-b border-border last:border-0">
                        <td className="px-3 py-2">{item.room_name}</td>
                        <td className="px-3 py-2">{item.product_type}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{item.width}″ × {item.height}″</td>
                        <td className="px-3 py-2">{item.quantity}</td>
                        <td className="px-3 py-2">{item.stitching_type || "—"}</td>
                        <td className="px-3 py-2">{item.lining || "—"}</td>
                        <td className="px-3 py-2">{item.hardware || "—"}</td>
                        <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex justify-end text-sm">
                <span className="text-muted-foreground mr-2">Grand Total:</span>
                <span className="font-display text-base font-semibold">{formatCurrency(o.grand_total)}</span>
              </div>
            </>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={onEdit}>Edit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
