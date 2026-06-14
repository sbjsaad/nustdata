"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { ChargeForm } from "@/components/charges/ChargeForm";
import { api, ApiClientError } from "@/lib/api";
import type { ChargeEntry } from "@/lib/types";

export default function EditChargePage() {
  const params = useParams();
  const id = params.id as string;
  const [entry, setEntry] = useState<ChargeEntry | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<ChargeEntry>(`/charges/${id}`)
      .then(setEntry)
      .catch((err) => setError(err instanceof ApiClientError ? err.message : "Not found"));
  }, [id]);

  return (
    <DashboardLayout title="Edit Charge" subtitle={`ID: ${id}`}>
      {error && <Alert type="error" message={error} />}
      <Card>{entry ? <ChargeForm mode="edit" id={id} initial={entry} /> : !error && <p>Loading...</p>}</Card>
    </DashboardLayout>
  );
}
