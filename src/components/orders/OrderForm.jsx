import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Label, Select, Textarea } from "@/components/ui/form-fields";
import { OrderItemsEditor } from "./OrderItemsEditor";
import { orderSchema, orderDefaultValues } from "@/utils/orderSchema";
import { PRIORITIES, ORDER_STATUSES } from "@/utils/constants";
import { getCustomers } from "@/services/customerService";
import { getOrderById } from "@/services/orderService";

export function OrderForm({ open, onOpenChange, order, onSubmit, isSubmitting }) {
  const isEdit = Boolean(order?.id);

  const { data: customers = [] } = useQuery({
    queryKey: ["customers-options"],
    queryFn: () => getCustomers({ status: "Active" }),
    enabled: open,
  });

  // The table row doesn't carry line items — fetch the full record when editing.
  const { data: fullOrder, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["order-detail", order?.id],
    queryFn: () => getOrderById(order.id),
    enabled: open && isEdit,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: orderDefaultValues,
  });

  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      const source = fullOrder || order;
      reset({
        customer_id: source.customer_id || source.customer?.id || "",
        project_name: source.project_name || "",
        site_location: source.site_location || "",
        expected_delivery_date: source.expected_delivery_date || "",
        priority: source.priority || "Normal",
        status: source.status || "Draft",
        remarks: source.remarks || "",
        items: source.items?.length ? source.items : orderDefaultValues.items,
      });
    } else {
      reset(orderDefaultValues);
    }
  }, [open, order, isEdit, fullOrder, reset]);

  const submit = async (values) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl">
        <DialogHeader onClose={() => onOpenChange(false)}>
          <DialogTitle>{isEdit ? "Edit Sales Order" : "New Sales Order"}</DialogTitle>
          <DialogDescription>
            {isEdit ? `Editing ${order.order_number}` : "Order number is generated automatically."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)}>
          <DialogBody>
            <div className="grid sm:grid-cols-3 gap-x-4 mb-5">
              <div className="mb-3">
                <Label>Customer *</Label>
                <Select {...register("customer_id")}>
                  <option value="">— select customer —</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.company_name} ({c.customer_code})</option>
                  ))}
                </Select>
                {errors.customer_id && <p className="mt-1 text-xs text-destructive">{errors.customer_id.message}</p>}
              </div>

              <div className="mb-3">
                <Label>Project Name *</Label>
                <Input {...register("project_name")} placeholder="e.g. Whitefield Villa" />
                {errors.project_name && <p className="mt-1 text-xs text-destructive">{errors.project_name.message}</p>}
              </div>

              <div className="mb-3">
                <Label>Site Location</Label>
                <Input {...register("site_location")} placeholder="e.g. Whitefield, Bengaluru" />
              </div>

              <div className="mb-3">
                <Label>Expected Delivery Date *</Label>
                <Input type="date" {...register("expected_delivery_date")} />
                {errors.expected_delivery_date && (
                  <p className="mt-1 text-xs text-destructive">{errors.expected_delivery_date.message}</p>
                )}
              </div>

              <div className="mb-3">
                <Label>Priority</Label>
                <Select {...register("priority")}>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
              </div>

              <div className="mb-3">
                <Label>Status</Label>
                <Select {...register("status")}>
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>

              <div className="mb-3 sm:col-span-3">
                <Label>Remarks</Label>
                <Textarea {...register("remarks")} rows={2} placeholder="Optional notes for this order" />
              </div>
            </div>

            <OrderItemsEditor control={control} register={register} errors={errors} />
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || (isEdit && isLoadingDetail)}>
              {isSubmitting && <Loader2 size={15} className="animate-spin" />}
              {isEdit ? "Save Changes" : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
