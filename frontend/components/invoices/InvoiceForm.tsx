"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import type { Invoice, InvoiceHead } from "@/lib/types";

interface InvoiceFormProps {
  initial?: Partial<Invoice>;
  id?: string;
  mode: "create" | "edit";
}

export function InvoiceForm({ initial, id, mode }: InvoiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    invoiceNo: initial?.invoiceNo || "",
    regNo: initial?.regNo || "",
    cmsId: initial?.cmsId || "",
    name: initial?.name || "",
    mobileNo: initial?.mobileNo || "",
    voucherMonth: initial?.voucherMonth || "",
    voucherYear: initial?.voucherYear || new Date().getFullYear().toString(),
    balance: String(initial?.balance ?? 0),
    amountAfterDueDate: String(initial?.amountAfterDueDate ?? 0),
    heads: (initial?.heads?.length ? initial.heads : [{ head: "Head 1", amount: 0 }]) as InvoiceHead[],
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const updateHead = (index: number, field: keyof InvoiceHead, value: string | number) => {
    setForm((p) => ({
      ...p,
      heads: p.heads.map((h, i) => (i === index ? { ...h, [field]: value } : h)),
    }));
  };

  const addHead = () => setForm((p) => ({ ...p, heads: [...p.heads, { head: "", amount: 0 }] }));
  const removeHead = (index: number) =>
    setForm((p) => ({ ...p, heads: p.heads.filter((_, i) => i !== index) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      balance: Number(form.balance),
      amountAfterDueDate: Number(form.amountAfterDueDate),
      heads: form.heads.map((h) => ({ head: h.head, amount: Number(h.amount) })),
    };

    try {
      if (mode === "create") {
        await api.post("/invoices", payload);
        router.push("/invoices");
      } else {
        await api.put(`/invoices/${id}`, payload);
        router.push("/invoices");
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to save invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Invoice No" value={form.invoiceNo} onChange={(e) => update("invoiceNo", e.target.value)} />
        <Input label="Reg No *" value={form.regNo} onChange={(e) => update("regNo", e.target.value)} required />
        <Input label="CMS ID" value={form.cmsId} onChange={(e) => update("cmsId", e.target.value)} />
        <Input label="Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
        <Input label="Mobile No" value={form.mobileNo} onChange={(e) => update("mobileNo", e.target.value)} />
        <Input label="Voucher Month" value={form.voucherMonth} onChange={(e) => update("voucherMonth", e.target.value)} />
        <Input label="Voucher Year" value={form.voucherYear} onChange={(e) => update("voucherYear", e.target.value)} />
        <Input label="Balance" type="number" min="0" value={form.balance} onChange={(e) => update("balance", e.target.value)} />
        <Input label="Amount After Due Date" type="number" min="0" value={form.amountAfterDueDate} onChange={(e) => update("amountAfterDueDate", e.target.value)} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900">Invoice Heads</h4>
          <Button type="button" variant="secondary" onClick={addHead}>Add Head</Button>
        </div>
        {form.heads.map((head, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-[1fr_150px_auto]">
            <Input label={`Head ${index + 1}`} value={head.head} onChange={(e) => updateHead(index, "head", e.target.value)} />
            <Input label="Amount" type="number" min="0" value={String(head.amount)} onChange={(e) => updateHead(index, "amount", e.target.value)} />
            {form.heads.length > 1 && (
              <div className="flex items-end">
                <Button type="button" variant="danger" onClick={() => removeHead(index)}>Remove</Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>{mode === "create" ? "Create Invoice" : "Update Invoice"}</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
