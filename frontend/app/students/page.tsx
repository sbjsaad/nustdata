"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ActionGroup, ActionLink } from "@/components/ui/ActionLink";
import { Button } from "@/components/ui/Button";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { api, ApiClientError } from "@/lib/api";
import { CATEGORY_LABELS, STUDENT_TYPE_LABELS, type Student } from "@/lib/types";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [studentType, setStudentType] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ search: "", category: "", studentType: "" });
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filters = useMemo(
    () => ({
      search: appliedFilters.search,
      category: appliedFilters.category,
      studentType: appliedFilters.studentType,
    }),
    [appliedFilters]
  );

  const { items, pagination, loading, error, setPage, setLimit, refresh } =
    usePaginatedFetch<Student>({ endpoint: "/students", listKey: "students", filters });

  const applySearch = () => setAppliedFilters({ search, category, studentType });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/students/${deleteTarget.cmsId}`);
      setDeleteTarget(null);
      refresh();
    } catch (err) {
      alert(err instanceof ApiClientError ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Students" subtitle="Create, view, update and delete student records">
      <div className="mb-4 flex justify-end">
        <Link href="/students/new">
          <Button>+ Add Student</Button>
        </Link>
      </div>

      <Card title="Search Students">
        <div className="grid gap-4 md:grid-cols-4">
          <Input label="Search" placeholder="Name, CMS ID, Reg No..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} options={[{ value: "", label: "All" }, ...Object.entries(CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l }))]} />
          <Select label="Student Type" value={studentType} onChange={(e) => setStudentType(e.target.value)} options={[{ value: "", label: "All" }, { value: "boarder", label: "Boarder" }, { value: "day_scholar", label: "Day Scholar" }]} />
          <div className="flex items-end">
            <Button className="w-full" onClick={applySearch}>Search</Button>
          </div>
        </div>
      </Card>

      {error && <Alert type="error" message={error} className="mt-4" />}

      <Card title={`Students (${pagination.total})`} className="mt-6">
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500">No students found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-2 pr-4">CMS ID</th>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Contact</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((s) => (
                    <tr key={s.cmsId} className="border-b border-slate-100">
                      <td className="py-2 pr-4 font-medium">{s.cmsId}</td>
                      <td className="py-2 pr-4">{s.name}</td>
                      <td className="py-2 pr-4">{s.category}</td>
                      <td className="py-2 pr-4">{STUDENT_TYPE_LABELS[s.studentType]}</td>
                      <td className="py-2 pr-4">{s.contactNumber || "-"}</td>
                      <td className="py-2">
                        <ActionGroup>
                          <ActionLink href={`/students/${s.cmsId}`} label="View" />
                          <ActionLink href={`/students/${s.cmsId}/edit`} label="Edit" variant="edit" />
                          <ActionLink label="Delete" variant="delete" onClick={() => setDeleteTarget(s)} />
                        </ActionGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination {...pagination} onPageChange={setPage} onLimitChange={setLimit} />
          </>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Student"
        message={`Delete student ${deleteTarget?.name} (${deleteTarget?.cmsId})?`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
}
