"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import { Card } from "../ui/Card";
import {
  CHARGE_TYPE_LABELS,
  CATEGORY_LABELS,
  type ChargeType,
  type StudentCategory,
  type StudentType,
} from "@/lib/types";

const chargeOptions = Object.entries(CHARGE_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function ChargeEntryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    cmsId: "",
    studentName: "",
    category: "NS" as StudentCategory,
    studentType: "day_scholar" as StudentType,
    chargeType: "messing" as ChargeType,
    amount: "",
    month: "",
    year: new Date().getFullYear().toString(),
    notes: "",
    submittedBy: "",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/charges", {
        ...form,
        amount: Number(form.amount),
      });
      setSuccess(`Charges saved for CMS ID: ${form.cmsId}`);
      setForm((prev) => ({ ...prev, amount: "", notes: "" }));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to save charges");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Add Student Charges" subtitle="Mess, washing, laundry and other charges">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="CMS ID *"
            value={form.cmsId}
            onChange={(e) => update("cmsId", e.target.value)}
            required
          />
          <Input
            label="Student Name"
            value={form.studentName}
            onChange={(e) => update("studentName", e.target.value)}
          />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            options={categoryOptions}
          />
          <Select
            label="Student Type"
            value={form.studentType}
            onChange={(e) => update("studentType", e.target.value)}
            options={[
              { value: "boarder", label: "Boarder" },
              { value: "day_scholar", label: "Day Scholar" },
            ]}
          />
          <Select
            label="Charge Type *"
            value={form.chargeType}
            onChange={(e) => update("chargeType", e.target.value)}
            options={chargeOptions}
          />
          <Input
            label="Amount (PKR) *"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => update("amount", e.target.value)}
            required
          />
          <Input
            label="Month"
            placeholder="e.g. January"
            value={form.month}
            onChange={(e) => update("month", e.target.value)}
          />
          <Input
            label="Year"
            value={form.year}
            onChange={(e) => update("year", e.target.value)}
          />
          <Input
            label="Submitted By"
            placeholder="Mess / Washing staff name"
            value={form.submittedBy}
            onChange={(e) => update("submittedBy", e.target.value)}
          />
        </div>

        <Input
          label="Notes"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
        />

        <div className="flex gap-3">
          <Button type="submit" loading={loading}>
            Save Charges
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => form.cmsId && router.push(`/students/${form.cmsId}`)}
          >
            View Student
          </Button>
        </div>
      </form>
    </Card>
  );
}
