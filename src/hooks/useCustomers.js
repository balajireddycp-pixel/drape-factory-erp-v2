import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/services/customerService";
import { toast } from "@/store/toastStore";

const QUERY_KEY = "customers";

export function useCustomers({ search = "", status = "All" } = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY, { search, status }],
    queryFn: () => getCustomers({ search, status }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      invalidate();
      toast.success("Customer created", "The new customer has been saved.");
    },
    onError: (err) => toast.error("Couldn't create customer", err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateCustomer(id, payload),
    onSuccess: () => {
      invalidate();
      toast.success("Customer updated", "Changes have been saved.");
    },
    onError: (err) => toast.error("Couldn't update customer", err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      invalidate();
      toast.success("Customer deleted", "The customer has been removed.");
    },
    onError: (err) => toast.error("Couldn't delete customer", err.message),
  });

  return {
    customers: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
    createCustomer: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCustomer: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCustomer: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
