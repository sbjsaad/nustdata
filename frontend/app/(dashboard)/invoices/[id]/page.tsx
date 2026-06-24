"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { api, ApiClientError } from "@/lib/api";
import type { Invoice } from "@/lib/types";
import { formatPKR } from "@/lib/chartUtils";

export default function InvoiceDetailPage() {
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
    <DashboardLayout title="Invoice Details" subtitle={invoice?.invoiceNo || invoice?.regNo}>
      {error && <Alert type="error" message={error} />}
      <Card>
        {invoice ? (
          <div className="space-y-2 text-sm">
            <p><strong>Invoice No:</strong> {invoice.invoiceNo}</p>
            <p><strong>Reg No:</strong> {invoice.regNo}</p>
            <p><strong>Name:</strong> {invoice.name}</p>
            <p><strong>Balance:</strong> {formatPKR(invoice.balance ?? 0)}</p>
            <div className="mt-4">
              <p className="font-semibold">Heads:</p>
              {invoice.heads?.map((h, i) => (
                <div key={i} className="flex justify-between border-b py-1">
                  <span>{h.head}</span><span>{formatPKR(h.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : !error && <p>Loading...</p>}
      </Card>
    </DashboardLayout>
  );
}
