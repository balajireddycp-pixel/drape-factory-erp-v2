import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Label, Select, Textarea } from "@/components/ui/form-fields";
import { customerSchema, customerDefaultValues } from "@/utils/customerSchema";

export function CustomerForm({ open, onOpenChange, customer, onSubmit, isSubmitting }) {
  const isEdit = Boolean(customer?.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: customerDefaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(customer ? { ...customerDefaultValues, ...customer } : customerDefaultValues);
    }
  }, [open, customer, reset]);

  const submit = async (values) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader onClose={() => onOpenChange(false)}>
          <DialogTitle>{isEdit ? "Edit Customer" : "New Customer"}</DialogTitle>
          <DialogDescription>
            {isEdit ? `Editing ${customer.customer_code}` : "Customer code is generated automatically."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)}>
          <DialogBody>
            <div className="grid sm:grid-cols-2 gap-x-4">
              <div className="mb-3">
                <Label>Company Name *</Label>
                <Input {...register("company_name")} placeholder="Acme Interiors Pvt Ltd" />
                {errors.company_name && <p className="mt-1 text-xs text-destructive">{errors.company_name.message}</p>}
              </div>

              <div className="mb-3">
                <Label>Contact Person *</Label>
                <Input {...register("contact_person")} placeholder="Full name" />
                {errors.contact_person && <p className="mt-1 text-xs text-destructive">{errors.contact_person.message}</p>}
              </div>

              <div className="mb-3">
                <Label>Mobile *</Label>
                <Input {...register("mobile")} placeholder="98765 43210" />
                {errors.mobile && <p className="mt-1 text-xs text-destructive">{errors.mobile.message}</p>}
              </div>

              <div className="mb-3">
                <Label>Email</Label>
                <Input type="email" {...register("email")} placeholder="name@company.com" />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="mb-3">
                <Label>GSTIN</Label>
                <Input {...register("gstin")} placeholder="22AAAAA0000A1Z5" />
              </div>

              <div className="mb-3">
                <Label>Credit Days</Label>
                <Input type="number" min="0" {...register("credit_days")} />
                {errors.credit_days && <p className="mt-1 text-xs text-destructive">{errors.credit_days.message}</p>}
              </div>

              <div className="mb-3 sm:col-span-2">
                <Label>Billing Address</Label>
                <Textarea {...register("billing_address")} rows={2} />
              </div>

              <div className="mb-3 sm:col-span-2">
                <Label>Shipping Address</Label>
                <Textarea {...register("shipping_address")} rows={2} />
              </div>

              <div className="mb-3">
                <Label>City</Label>
                <Input {...register("city")} />
              </div>

              <div className="mb-3">
                <Label>State</Label>
                <Input {...register("state")} />
              </div>

              <div className="mb-3">
                <Label>Pincode</Label>
                <Input {...register("pincode")} />
              </div>

              <div className="mb-3">
                <Label>Status</Label>
                <Select {...register("status")}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </div>

              <div className="mb-3 sm:col-span-2">
                <Label>Notes</Label>
                <Textarea {...register("notes")} rows={2} />
              </div>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 size={15} className="animate-spin" />}
              {isEdit ? "Save Changes" : "Create Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
