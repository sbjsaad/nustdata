"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import { CATEGORY_LABELS, type Category, type StudentCategory } from "@/lib/types";

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }));

interface CategoryFormProps {
  initial?: Partial<Category>;
  code?: string;
  mode: "create" | "edit";
  onSuccess?: () => void;
}

export function CategoryForm({ initial, code, mode, onSuccess }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    code: (initial?.code || "NS") as StudentCategory,
    name: initial?.name || "",
    description: initial?.description || "",
    chargeHeads: (initial?.chargeHeads || []).join(", "),
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      code: form.code,
      name: form.name,
      description: form.description,
      chargeHeads: form.chargeHeads.split(",").map((h) => h.trim()).filter(Boolean),
    };

    try {
      if (mode === "create") {
        await api.post("/categories", payload);
      } else {
        await api.put(`/categories/${code}`, payload);
      }
      onSuccess?.();
      router.refresh();
      if (mode === "create") {
        setForm({ code: "NS", name: "", description: "", chargeHeads: "" });
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}
      <div className="grid gap-4 md:grid-cols-2">
        <Select label="Code *" value={form.code} onChange={(e) => update("code", e.target.value)} options={categoryOptions} disabled={mode === "edit"} />
        <Input label="Name *" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        <Input label="Description" value={form.description} onChange={(e) => update("description", e.target.value)} className="md:col-span-2" />
        <Input label="Charge Heads (comma separated)" value={form.chargeHeads} onChange={(e) => update("chargeHeads", e.target.value)} className="md:col-span-2" />
      </div>
      <Button type="submit" loading={loading}>{mode === "create" ? "Create Category" : "Update Category"}</Button>
    </form>
  );
}
