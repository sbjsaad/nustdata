"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ActionGroup, ActionLink } from "@/components/ui/ActionLink";
import { Button } from "@/components/ui/Button";
import { ChargeForm } from "@/components/charges/ChargeForm";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { api, ApiClientError } from "@/lib/api";
import { CHARGE_TYPE_LABELS, type ChargeEntry } from "@/lib/types";

export default function ChargesPage() {
  const [tab, setTab] = useState<"list" | "add">("list");
  const [deleteTarget, setDeleteTarget] = useState<ChargeEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { items, pagination, loading, error, setPage, setLimit, refresh } =
    usePaginatedFetch<ChargeEntry>({ endpoint: "/charges", listKey: "entries", enabled: tab === "list" });

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    try {
      await api.delete(`/charges/${deleteTarget._id}`);
      setDeleteTarget(null);
      refresh();
    } catch (err) {
      alert(err instanceof ApiClientError ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Charges" subtitle="Manage messing, washing and other charges">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant={tab === "list" ? "primary" : "secondary"} onClick={() => setTab("list")}>All Charges</Button>
        <Button variant={tab === "add" ? "primary" : "secondary"} onClick={() => setTab("add")}>Add Charge</Button>
      </div>

      {tab === "add" ? (
        <Card title="Add Student Charges" subtitle="Mess, washing, laundry and other charges">
          <ChargeForm mode="create" />
        </Card>
      ) : (
        <Card title={`Charge Entries (${pagination.total})`}>
          {error && <Alert type="error" message={error} className="mb-4" />}
          {loading ? <p className="text-sm text-slate-500">Loading...</p> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="py-2 pr-4">CMS ID</th>
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Type</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Month</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((c) => (
                      <tr key={c._id} className="border-b border-slate-100">
                        <td className="py-2 pr-4">
                          <Link href={`/students/${c.cmsId}`} className="text-indigo-600 hover:underline">{c.cmsId}</Link>
                        </td>
                        <td className="py-2 pr-4">{c.studentName || "-"}</td>
                        <td className="py-2 pr-4">{CHARGE_TYPE_LABELS[c.chargeType]}</td>
                        <td className="py-2 pr-4">PKR {c.amount}</td>
                        <td className="py-2 pr-4">{c.month} {c.year}</td>
                        <td className="py-2">
                          <ActionGroup>
                            <ActionLink href={`/charges/${c._id}/edit`} label="Edit" variant="edit" />
                            <ActionLink label="Delete" variant="delete" onClick={() => setDeleteTarget(c)} />
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
      )}

      <ConfirmDialog open={!!deleteTarget} title="Delete Charge" message="Delete this charge entry?" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </DashboardLayout>
  );
}
