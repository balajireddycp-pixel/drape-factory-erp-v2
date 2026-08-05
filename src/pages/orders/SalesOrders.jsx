import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderSearch } from "@/components/orders/OrderSearch";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderForm } from "@/components/orders/OrderForm";
import { OrderView } from "@/components/orders/OrderView";
import { DeleteOrderDialog } from "@/components/orders/DeleteOrderDialog";
import { useOrders } from "@/hooks/useOrders";

export default function SalesOrders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  const {
    orders,
    isLoading,
    isFetching,
    refetch,
    createOrder,
    isCreating,
    updateOrder,
    isUpdating,
    deleteOrder,
    isDeleting,
  } = useOrders({ search, status });

  const openCreate = () => { setActiveOrder(null); setFormOpen(true); };
  const openEdit = (order) => { setActiveOrder(order); setViewOpen(false); setFormOpen(true); };
  const openView = (order) => { setActiveOrder(order); setViewOpen(true); };
  const openDelete = (order) => { setActiveOrder(order); setDeleteOpen(true); };

  const handleFormSubmit = async (values) => {
    if (activeOrder?.id) {
      await updateOrder({ id: activeOrder.id, payload: values });
    } else {
      await createOrder(values);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteOrder(activeOrder.id);
      setDeleteOpen(false);
    } catch {
      // toast already shown by the hook
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold">Sales Orders</h1>
          <p className="text-sm text-muted-foreground">Manage curtain &amp; blinds orders from quote to dispatch</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus size={14} />
            New Order
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <OrderSearch value={search} onChange={setSearch} />
        <OrderFilters value={status} onChange={setStatus} />
      </div>

      <OrderTable
        orders={orders}
        isLoading={isLoading}
        onView={openView}
        onEdit={openEdit}
        onDelete={openDelete}
        onCreate={openCreate}
      />

      <OrderForm
        open={formOpen}
        onOpenChange={setFormOpen}
        order={activeOrder}
        onSubmit={handleFormSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      <OrderView
        open={viewOpen}
        onOpenChange={setViewOpen}
        order={activeOrder}
        onEdit={() => openEdit(activeOrder)}
      />

      <DeleteOrderDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        order={activeOrder}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
