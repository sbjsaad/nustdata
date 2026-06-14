"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { api, ApiClientError } from "@/lib/api";
import type { Billing } from "@/lib/types";

export default function BillingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [billing, setBilling] = useState<Billing | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<Billing>(`/billing/${id}`)
      .then(setBilling)
      .catch((err) => setError(err instanceof ApiClientError ? err.message : "Not found"));
  }, [id]);

  if (error) return <DashboardLayout title="Billing"><Alert type="error" message={error} /></DashboardLayout>;

  return (
    <DashboardLayout title="Billing Details" subtitle={billing?.cmsId}>
      <Card>
        {billing ? (
          <div className="space-y-2 text-sm">
            <p><strong>CMS ID:</strong> {billing.cmsId}</p>
            <p><strong>Name:</strong> {billing.name}</p>
            <p><strong>Period:</strong> {billing.voucherMonth} {billing.voucherYear}</p>
            <p><strong>Total Bill:</strong> PKR {billing.totalBill}</p>
            <p><strong>Paid:</strong> PKR {billing.paid}</p>
            <p><strong>Balance:</strong> PKR {billing.balance}</p>
            <pre className="mt-4 rounded bg-slate-50 p-4 text-xs">{JSON.stringify(billing.charges, null, 2)}</pre>
          </div>
        ) : <p className="text-sm text-slate-500">Loading...</p>}
      </Card>
    </DashboardLayout>
  );
}
