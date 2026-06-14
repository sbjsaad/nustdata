"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import type { Billing, BillingCharges } from "@/lib/types";

const chargeFields: { key: keyof BillingCharges; label: string }[] = [
  { key: "arrear", label: "Arrear" },
  { key: "sixMonthFixCharges", label: "Six Month Fix Charges" },
  { key: "securityHM", label: "Security H/M" },
  { key: "wrContribution", label: "W&R Contribution" },
  { key: "laundryCharges", label: "Laundry Charges" },
  { key: "umsCharges", label: "UMS Charges" },
  { key: "sportsCharges", label: "Sports Charges" },
  { key: "degreeCharges", label: "Degree Charges" },
  { key: "dhobiUWash", label: "Dhobi / Washing" },
  { key: "messingCharges", label: "Messing Charges" },
  { key: "processingFees", label: "Processing Fees" },
];

interface BillingFormProps {
  initial?: Partial<Billing>;
  id?: string;
  mode: "create" | "edit";
}

export function BillingForm({ initial, id, mode }: BillingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    cmsId: initial?.cmsId || "",
    name: initial?.name || "",
    category: initial?.category || "NS",
    voucherMonth: initial?.voucherMonth || "",
    voucherYear: initial?.voucherYear || new Date().getFullYear().toString(),
    totalBill: String(initial?.totalBill ?? 0),
    paid: String(initial?.paid ?? 0),
    lateFeeFine: String(initial?.lateFeeFine ?? 0),
    balance: String(initial?.balance ?? 0),
    charges: chargeFields.reduce((acc, f) => {
      acc[f.key] = String(initial?.charges?.[f.key] ?? 0);
      return acc;
    }, {} as Record<string, string>),
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));
  const updateCharge = (key: string, value: string) =>
    setForm((p) => ({ ...p, charges: { ...p.charges, [key]: value } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      cmsId: form.cmsId,
      name: form.name,
      category: form.category,
      voucherMonth: form.voucherMonth,
      voucherYear: form.voucherYear,
      totalBill: Number(form.totalBill),
      paid: Number(form.paid),
      lateFeeFine: Number(form.lateFeeFine),
      balance: Number(form.balance),
      charges: Object.fromEntries(
        Object.entries(form.charges).map(([k, v]) => [k, Number(v)])
      ),
    };

    try {
      if (mode === "create") {
        await api.post("/billing", payload);
        router.push("/billing");
      } else {
        await api.put(`/billing/${id}`, payload);
        router.push("/billing");
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to save billing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="CMS ID *" value={form.cmsId} onChange={(e) => update("cmsId", e.target.value)} required />
        <Input label="Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
        <Input label="Category" value={form.category} onChange={(e) => update("category", e.target.value)} />
        <Input label="Voucher Month" value={form.voucherMonth} onChange={(e) => update("voucherMonth", e.target.value)} />
        <Input label="Voucher Year" value={form.voucherYear} onChange={(e) => update("voucherYear", e.target.value)} />
        {chargeFields.map((f) => (
          <Input key={f.key} label={f.label} type="number" min="0" value={form.charges[f.key]} onChange={(e) => updateCharge(f.key, e.target.value)} />
        ))}
        <Input label="Total Bill" type="number" min="0" value={form.totalBill} onChange={(e) => update("totalBill", e.target.value)} />
        <Input label="Paid" type="number" min="0" value={form.paid} onChange={(e) => update("paid", e.target.value)} />
        <Input label="Late Fee Fine" type="number" min="0" value={form.lateFeeFine} onChange={(e) => update("lateFeeFine", e.target.value)} />
        <Input label="Balance" type="number" min="0" value={form.balance} onChange={(e) => update("balance", e.target.value)} />
      </div>
      <div className="flex gap-3">
        <Button type="submit" loading={loading}>{mode === "create" ? "Create Billing" : "Update Billing"}</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
