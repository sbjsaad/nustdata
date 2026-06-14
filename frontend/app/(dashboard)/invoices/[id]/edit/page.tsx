"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { api, ApiClientError } from "@/lib/api";
import type { Invoice } from "@/lib/types";

export default function EditInvoicePage() {
  const params = useParams();
  const id = params.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<Invoice>(`/invoices/${id}`)
      .then(setInvoice)
      .catch((err) => setError(err instanceof ApiClientError ? err.message : "Not found"));
  }, [id]);

  return (
    <DashboardLayout title="Edit Invoice" subtitle={`ID: ${id}`}>
      {error && <Alert type="error" message={error} />}
      <Card>{invoice ? <InvoiceForm mode="edit" id={id} initial={invoice} /> : !error && <p>Loading...</p>}</Card>
    </DashboardLayout>
  );
}
