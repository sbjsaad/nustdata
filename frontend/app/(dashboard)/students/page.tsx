"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

type BulkDeleteMode = "selected" | "all" | null;

function StudentsList() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(urlCategory);
  const [studentType, setStudentType] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ search: "", category: urlCategory, studentType: "" });
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteMode, setBulkDeleteMode] = useState<BulkDeleteMode>(null);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");

  useEffect(() => {
    setCategory(urlCategory);
    setAppliedFilters((prev) => ({ ...prev, category: urlCategory }));
    setSelectedIds([]);
  }, [urlCategory]);

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

  const applySearch = () => {
    setAppliedFilters({ search, category, studentType });
    setSelectedIds([]);
  };

  const pageIds = items.map((s) => s.cmsId);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

  const toggleSelectAllPage = () => {
    if (allPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  const toggleSelect = (cmsId: string) => {
    setSelectedIds((prev) =>
      prev.includes(cmsId) ? prev.filter((id) => id !== cmsId) : [...prev, cmsId]
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/students/${deleteTarget.cmsId}`);
      setDeleteTarget(null);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.cmsId));
      refresh();
    } catch (err) {
      alert(err instanceof ApiClientError ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    setDeleting(true);
    setBulkMessage("");
    try {
      const payload =
        bulkDeleteMode === "all"
          ? { deleteAll: true, confirmText: deleteAllConfirm }
          : { cmsIds: selectedIds };

      const res = await api.post<{
        deletedStudents: number;
        deletedBillings: number;
        deletedInvoices: number;
        deletedCharges: number;
      }>("/students/bulk-delete", payload);

      setBulkDeleteMode(null);
      setDeleteAllConfirm("");
      setSelectedIds([]);
      setBulkMessage(
        `Permanently deleted ${res.deletedStudents} students, ${res.deletedBillings} billing records, ${res.deletedInvoices} invoices, and ${res.deletedCharges} manual charges.`
      );
      refresh();
    } catch (err) {
      alert(err instanceof ApiClientError ? err.message : "Bulk delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Students" subtitle="Create, view, update and delete student records">
      <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
        {selectedIds.length > 0 && (
          <Button variant="danger" onClick={() => setBulkDeleteMode("selected")}>
            Delete Selected ({selectedIds.length})
          </Button>
        )}
        <Button variant="danger" onClick={() => setBulkDeleteMode("all")}>
          Delete All Students
        </Button>
        <Link href="/students/new">
          <Button>+ Add Student</Button>
        </Link>
      </div>

      {bulkMessage && <Alert type="success" message={bulkMessage} className="mb-4" />}

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
                    <th className="py-2 pr-3">
                      <input
                        type="checkbox"
                        checked={allPageSelected}
                        onChange={toggleSelectAllPage}
                        aria-label="Select all on this page"
                        className="rounded border-slate-300"
                      />
                    </th>
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
                      <td className="py-2 pr-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(s.cmsId)}
                          onChange={() => toggleSelect(s.cmsId)}
                          aria-label={`Select ${s.name}`}
                          className="rounded border-slate-300"
                        />
                      </td>
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
        title="Hard Delete Student"
        message={`Permanently delete ${deleteTarget?.name} (${deleteTarget?.cmsId}) and all related billing, invoice, and charge records? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={bulkDeleteMode === "selected"}
        title="Hard Delete Selected Students"
        message={`Permanently delete ${selectedIds.length} selected student(s) and all related billing, invoice, and charge records? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteMode(null)}
      />

      {bulkDeleteMode === "all" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-red-700">Delete All Students</h3>
            <p className="mt-2 text-sm text-slate-600">
              This will permanently delete every student, billing record, invoice, and manual charge
              in the database. Type <span className="font-mono font-semibold">DELETE ALL</span> to confirm.
            </p>
            <div className="mt-4">
              <Input
                label="Confirmation"
                placeholder="DELETE ALL"
                value={deleteAllConfirm}
                onChange={(e) => setDeleteAllConfirm(e.target.value)}
              />
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setBulkDeleteMode(null);
                  setDeleteAllConfirm("");
                }}
                disabled={deleting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleBulkDelete}
                loading={deleting}
                disabled={deleteAllConfirm !== "DELETE ALL"}
                className="w-full sm:w-auto"
              >
                Delete Everything
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading page...</p>}>
      <StudentsList />
    </Suspense>
  );
}
