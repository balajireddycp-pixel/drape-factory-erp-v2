import { useState } from "react";
import { Plus, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerSearch } from "@/components/customers/CustomerSearch";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerView } from "@/components/customers/CustomerView";
import { DeleteCustomerDialog } from "@/components/customers/DeleteCustomerDialog";
import { useCustomers } from "@/hooks/useCustomers";
import { exportToCsv } from "@/utils/exportCsv";
import { toast } from "@/store/toastStore";

const EXPORT_COLUMNS = [
  { key: "customer_code", label: "Customer Code" },
  { key: "company_name", label: "Company Name" },
  { key: "contact_person", label: "Contact Person" },
  { key: "mobile", label: "Mobile" },
  { key: "email", label: "Email" },
  { key: "gstin", label: "GSTIN" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "pincode", label: "Pincode" },
  { key: "credit_days", label: "Credit Days" },
  { key: "status", label: "Status" },
];

export default function CustomerMaster() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState(null);

  const {
    customers,
    isLoading,
    isFetching,
    refetch,
    createCustomer,
    isCreating,
    updateCustomer,
    isUpdating,
    deleteCustomer,
    isDeleting,
  } = useCustomers({ search, status });

  const openCreate = () => { setActiveCustomer(null); setFormOpen(true); };
  const openEdit = (customer) => { setActiveCustomer(customer); setViewOpen(false); setFormOpen(true); };
  const openView = (customer) => { setActiveCustomer(customer); setViewOpen(true); };
  const openDelete = (customer) => { setActiveCustomer(customer); setDeleteOpen(true); };

  const handleFormSubmit = async (values) => {
    if (activeCustomer?.id) {
      await updateCustomer({ id: activeCustomer.id, payload: values });
    } else {
      await createCustomer(values);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCustomer(activeCustomer.id);
      setDeleteOpen(false);
    } catch {
      // toast already shown by the hook
    }
  };

  const handleExport = () => {
    if (!customers.length) {
      toast({ title: "Nothing to export", description: "No customers match the current filters." });
      return;
    }
    exportToCsv(`customers-${new Date().toISOString().slice(0, 10)}.csv`, customers, EXPORT_COLUMNS);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold">Customer Master</h1>
          <p className="text-sm text-muted-foreground">Manage customer database</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download size={14} />
            Export
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus size={14} />
            New Customer
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <CustomerSearch value={search} onChange={setSearch} />
        <CustomerFilters value={status} onChange={setStatus} />
      </div>

      <CustomerTable
        customers={customers}
        isLoading={isLoading}
        onView={openView}
        onEdit={openEdit}
        onDelete={openDelete}
        onCreate={openCreate}
      />

      <CustomerForm
        open={formOpen}
        onOpenChange={setFormOpen}
        customer={activeCustomer}
        onSubmit={handleFormSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      <CustomerView
        open={viewOpen}
        onOpenChange={setViewOpen}
        customer={activeCustomer}
        onEdit={() => openEdit(activeCustomer)}
      />

      <DeleteCustomerDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        customer={activeCustomer}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
