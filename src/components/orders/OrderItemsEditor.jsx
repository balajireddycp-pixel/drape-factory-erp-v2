import { useFieldArray, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/form-fields";
import { PRODUCT_TYPES, STITCHING_TYPES, LINING_OPTIONS, HARDWARE_OPTIONS } from "@/utils/constants";
import { orderItemDefaultValues } from "@/utils/orderSchema";
import { formatCurrency } from "@/lib/utils";

function ItemAmount({ control, index }) {
  const qty = useWatch({ control, name: `items.${index}.quantity` });
  const price = useWatch({ control, name: `items.${index}.unit_price` });
  const amount = (Number(qty) || 0) * (Number(price) || 0);
  return <span className="text-sm font-medium whitespace-nowrap">{formatCurrency(amount)}</span>;
}

export function OrderItemsEditor({ control, register, errors }) {
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = useWatch({ control, name: "items" }) || [];
  const grandTotal = items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unit_price) || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">Order Items</p>
        <Button type="button" size="sm" variant="outline" onClick={() => append(orderItemDefaultValues)}>
          <Plus size={14} /> Add Item
        </Button>
      </div>
      {errors.items?.root && <p className="mb-2 text-xs text-destructive">{errors.items.root.message}</p>}
      {errors.items?.message && <p className="mb-2 text-xs text-destructive">{errors.items.message}</p>}

      <div className="space-y-3">
        {fields.map((field, index) => {
          const itemErrors = errors.items?.[index] || {};
          return (
            <div key={field.id} className="rounded-md border border-border p-3">
              <div className="grid sm:grid-cols-4 gap-x-3 gap-y-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Room *</label>
                  <Input {...register(`items.${index}.room_name`)} placeholder="e.g. Living Room" />
                  {itemErrors.room_name && <p className="mt-1 text-xs text-destructive">{itemErrors.room_name.message}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Product Type</label>
                  <Select {...register(`items.${index}.product_type`)}>
                    {PRODUCT_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Width (in)</label>
                  <Input type="number" step="0.1" {...register(`items.${index}.width`)} />
                  {itemErrors.width && <p className="mt-1 text-xs text-destructive">{itemErrors.width.message}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Height (in)</label>
                  <Input type="number" step="0.1" {...register(`items.${index}.height`)} />
                  {itemErrors.height && <p className="mt-1 text-xs text-destructive">{itemErrors.height.message}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Quantity</label>
                  <Input type="number" min="1" {...register(`items.${index}.quantity`)} />
                  {itemErrors.quantity && <p className="mt-1 text-xs text-destructive">{itemErrors.quantity.message}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Stitching Type</label>
                  <Select {...register(`items.${index}.stitching_type`)}>
                    {STITCHING_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Lining</label>
                  <Select {...register(`items.${index}.lining`)}>
                    {LINING_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Hardware</label>
                  <Select {...register(`items.${index}.hardware`)}>
                    {HARDWARE_OPTIONS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Unit Price</label>
                  <Input type="number" step="0.01" min="0" {...register(`items.${index}.unit_price`)} />
                  {itemErrors.unit_price && <p className="mt-1 text-xs text-destructive">{itemErrors.unit_price.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-muted-foreground">Remarks</label>
                  <Input {...register(`items.${index}.remarks`)} placeholder="Optional" />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="mb-1 block text-xs text-muted-foreground">Amount</label>
                  <div className="flex h-9 items-center">
                    <ItemAmount control={control} index={index} />
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={14} /> Remove
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-end border-t border-border pt-3">
        <div className="text-sm">
          <span className="text-muted-foreground mr-2">Grand Total:</span>
          <span className="font-display text-base font-semibold">{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
