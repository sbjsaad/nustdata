"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ActionGroup, ActionLink } from "@/components/ui/ActionLink";
import { Button } from "@/components/ui/Button";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { api, ApiClientError } from "@/lib/api";
import type { Billing } from "@/lib/types";

type BulkDeleteMode = "selected" | "all" | null;

export default function BillingPage() {
  const [cmsId, setCmsId] = useState("");
  const [appliedCmsId, setAppliedCmsId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Billing | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteMode, setBulkDeleteMode] = useState<BulkDeleteMode>(null);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");

  const filters = useMemo(() => ({ cmsId: appliedCmsId }), [appliedCmsId]);
  const { items, pagination, loading, error, setPage, setLimit, refresh } =
    usePaginatedFetch<Billing>({ endpoint: "/billing", listKey: "billings", filters });

  const applyFilter = () => {
    setAppliedCmsId(cmsId);
    setSelectedIds([]);
  };

  const pageIds = items.map((b) => b._id).filter(Boolean) as string[];
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

  const toggleSelectAllPage = () => {
    if (allPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    try {
      await api.delete(`/billing/${deleteTarget._id}`);
      setDeleteTarget(null);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget._id));
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
          : { ids: selectedIds };

      const res = await api.post<{ deletedBillings: number }>("/billing/bulk-delete", payload);

      setBulkDeleteMode(null);
      setDeleteAllConfirm("");
      setSelectedIds([]);
      setBulkMessage(`Permanently deleted ${res.deletedBillings} billing record(s).`);
      refresh();
    } catch (err) {
      alert(err instanceof ApiClientError ? err.message : "Bulk delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Billing" subtitle="Monthly billing records — full CRUD">
      <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
        {selectedIds.length > 0 && (
          <Button variant="danger" onClick={() => setBulkDeleteMode("selected")}>
            Delete Selected ({selectedIds.length})
          </Button>
        )}
        <Button variant="danger" onClick={() => setBulkDeleteMode("all")}>
          Delete All Billing
        </Button>
        <Link href="/billing/new">
          <Button>+ Add Billing</Button>
        </Link>
      </div>

      {bulkMessage && <Alert type="success" message={bulkMessage} className="mb-4" />}

      <Card title="Filter">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            label="CMS ID"
            value={cmsId}
            onChange={(e) => setCmsId(e.target.value)}
            className="flex-1"
          />
          <div className="flex items-end sm:shrink-0">
            <Button className="w-full sm:w-auto" onClick={applyFilter}>
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {error && <Alert type="error" message={error} className="mt-4" />}

      <Card title={`Billing Records (${pagination.total})`} className="mt-6">
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500">No billing records found.</p>
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
                    <th className="py-2 pr-4">Month/Year</th>
                    <th className="py-2 pr-4">Total</th>
                    <th className="py-2 pr-4">Paid</th>
                    <th className="py-2 pr-4">Balance</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((b) => (
                    <tr key={b._id} className="border-b border-slate-100">
                      <td className="py-2 pr-3">
                        {b._id && (
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(b._id)}
                            onChange={() => toggleSelect(b._id!)}
                            aria-label={`Select billing for ${b.cmsId}`}
                            className="rounded border-slate-300"
                          />
                        )}
                      </td>
                      <td className="py-2 pr-4">{b.cmsId}</td>
                      <td className="py-2 pr-4">{b.name || "-"}</td>
                      <td className="py-2 pr-4">
                        {b.voucherMonth || "—"} {b.voucherYear || ""}
                      </td>
                      <td className="py-2 pr-4">{b.totalBill}</td>
                      <td className="py-2 pr-4 text-green-600">{b.paid}</td>
                      <td className="py-2 pr-4 text-red-600">{b.balance}</td>
                      <td className="py-2">
                        <ActionGroup>
                          <ActionLink href={`/billing/${b._id}`} label="View" />
                          <ActionLink href={`/billing/${b._id}/edit`} label="Edit" variant="edit" />
                          <ActionLink label="Delete" variant="delete" onClick={() => setDeleteTarget(b)} />
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
        title="Hard Delete Billing"
        message={`Permanently delete billing for ${deleteTarget?.cmsId} (${deleteTarget?.voucherMonth} ${deleteTarget?.voucherYear})? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={bulkDeleteMode === "selected"}
        title="Hard Delete Selected Billing"
        message={`Permanently delete ${selectedIds.length} selected billing record(s)? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteMode(null)}
      />

      {bulkDeleteMode === "all" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-red-700">Delete All Billing Records</h3>
            <p className="mt-2 text-sm text-slate-600">
              This will permanently delete every billing record in the database. Students and other
              data will not be affected. Type{" "}
              <span className="font-mono font-semibold">DELETE ALL</span> to confirm.
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
