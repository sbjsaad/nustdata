"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import { CATEGORY_LABELS, type Student, type StudentCategory, type StudentType } from "@/lib/types";

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }));

interface StudentFormProps {
  initial?: Partial<Student>;
  cmsId?: string;
  mode: "create" | "edit";
}

export function StudentForm({ initial, cmsId, mode }: StudentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    cmsId: initial?.cmsId || "",
    regNo: initial?.regNo || "",
    name: initial?.name || "",
    category: (initial?.category || "NS") as StudentCategory,
    studentType: (initial?.studentType || "boarder") as StudentType,
    fatherName: initial?.fatherName || "",
    fatherOccupation: initial?.fatherOccupation || "",
    contactNumber: initial?.contactNumber || "",
    email: initial?.email || "",
    gender: initial?.gender || "",
    location: initial?.location || "",
    de: initial?.de || "",
    discipline: initial?.discipline || "",
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "create") {
        await api.post("/students", form);
        router.push("/students");
      } else {
        await api.put(`/students/${cmsId}`, form);
        router.push(`/students/${cmsId}`);
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="CMS ID *" value={form.cmsId} onChange={(e) => update("cmsId", e.target.value)} required disabled={mode === "edit"} />
        <Input label="Reg No" value={form.regNo} onChange={(e) => update("regNo", e.target.value)} />
        <Input label="Name *" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        <Select label="Category" value={form.category} onChange={(e) => update("category", e.target.value)} options={categoryOptions} />
        <Select label="Student Type" value={form.studentType} onChange={(e) => update("studentType", e.target.value)} options={[{ value: "boarder", label: "Boarder" }, { value: "day_scholar", label: "Day Scholar" }]} />
        <Input label="Father Name" value={form.fatherName} onChange={(e) => update("fatherName", e.target.value)} />
        <Input label="Father Occupation" value={form.fatherOccupation} onChange={(e) => update("fatherOccupation", e.target.value)} />
        <Input label="Contact Number" value={form.contactNumber} onChange={(e) => update("contactNumber", e.target.value)} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        <Input label="Gender" value={form.gender} onChange={(e) => update("gender", e.target.value)} />
        <Input label="Location" value={form.location} onChange={(e) => update("location", e.target.value)} />
        <Input label="DE" value={form.de} onChange={(e) => update("de", e.target.value)} />
        <Input label="Discipline" value={form.discipline} onChange={(e) => update("discipline", e.target.value)} />
      </div>
      <div className="flex gap-3">
        <Button type="submit" loading={loading}>{mode === "create" ? "Create Student" : "Update Student"}</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
