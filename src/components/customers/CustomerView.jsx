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
import { formatDate } from "@/lib/utils";

function Row({ label, value }) {
  return (
    <div className="py-2 border-b border-border last:border-0 grid grid-cols-3 gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="col-span-2 text-sm break-words">{value || "—"}</span>
    </div>
  );
}

export function CustomerView({ open, onOpenChange, customer, onEdit }) {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader onClose={() => onOpenChange(false)}>
          <DialogTitle>{customer.company_name}</DialogTitle>
          <DialogDescription>{customer.customer_code}</DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="mb-3">
            <Badge variant={customer.status === "Active" ? "success" : "muted"}>{customer.status}</Badge>
          </div>
          <Row label="Contact Person" value={customer.contact_person} />
          <Row label="Mobile" value={customer.mobile} />
          <Row label="Email" value={customer.email} />
          <Row label="GSTIN" value={customer.gstin} />
          <Row label="Billing Address" value={customer.billing_address} />
          <Row label="Shipping Address" value={customer.shipping_address} />
          <Row label="City" value={customer.city} />
          <Row label="State" value={customer.state} />
          <Row label="Pincode" value={customer.pincode} />
          <Row label="Credit Days" value={`${customer.credit_days ?? 0} days`} />
          <Row label="Notes" value={customer.notes} />
          <Row label="Created" value={formatDate(customer.created_at)} />
          <Row label="Last Updated" value={formatDate(customer.updated_at)} />
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={onEdit}>Edit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
