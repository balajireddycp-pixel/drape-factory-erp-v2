import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, createOrder, updateOrder, deleteOrder } from "@/services/orderService";
import { toast } from "@/store/toastStore";

const QUERY_KEY = "orders";

export function useOrders({ search = "", status = "All" } = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY, { search, status }],
    queryFn: () => getOrders({ search, status }),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    // Orders feed the dashboard's KPI cards and recent-orders widget.
    queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    queryClient.invalidateQueries({ queryKey: ["recent-orders"] });
    queryClient.invalidateQueries({ queryKey: ["production-stages"] });
  };

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      invalidate();
      toast.success("Order created", "The sales order has been saved.");
    },
    onError: (err) => toast.error("Couldn't create order", err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateOrder(id, payload),
    onSuccess: () => {
      invalidate();
      toast.success("Order updated", "Changes have been saved.");
    },
    onError: (err) => toast.error("Couldn't update order", err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      invalidate();
      toast.success("Order deleted", "The order has been removed.");
    },
    onError: (err) => toast.error("Couldn't delete order", err.message),
  });

  return {
    orders: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
    createOrder: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateOrder: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteOrder: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
