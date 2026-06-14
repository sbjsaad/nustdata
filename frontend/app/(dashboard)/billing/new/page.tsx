import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { BillingForm } from "@/components/billing/BillingForm";

export default function NewBillingPage() {
  return (
    <DashboardLayout title="Add Billing" subtitle="Create a new monthly billing record">
      <Card><BillingForm mode="create" /></Card>
    </DashboardLayout>
  );
}
