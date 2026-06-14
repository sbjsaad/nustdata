import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <DashboardLayout title="Add Invoice" subtitle="Create a new invoice / voucher">
      <Card><InvoiceForm mode="create" /></Card>
    </DashboardLayout>
  );
}
