"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { BillingForm } from "@/components/billing/BillingForm";
import { api, ApiClientError } from "@/lib/api";
import type { Billing } from "@/lib/types";

export default function EditBillingPage() {
  const params = useParams();
  const id = params.id as string;
  const [billing, setBilling] = useState<Billing | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<Billing>(`/billing/${id}`)
      .then(setBilling)
      .catch((err) => setError(err instanceof ApiClientError ? err.message : "Not found"));
  }, [id]);

  return (
    <DashboardLayout title="Edit Billing" subtitle={`ID: ${id}`}>
      {error && <Alert type="error" message={error} />}
      <Card>{billing ? <BillingForm mode="edit" id={id} initial={billing} /> : !error && <p>Loading...</p>}</Card>
    </DashboardLayout>
  );
}
