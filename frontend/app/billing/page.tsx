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

export default function BillingPage() {
  const [cmsId, setCmsId] = useState("");
  const [appliedCmsId, setAppliedCmsId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Billing | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filters = useMemo(() => ({ cmsId: appliedCmsId }), [appliedCmsId]);
  const { items, pagination, loading, error, setPage, setLimit, refresh } =
    usePaginatedFetch<Billing>({ endpoint: "/billing", listKey: "billings", filters });

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    try {
      await api.delete(`/billing/${deleteTarget._id}`);
      setDeleteTarget(null);
      refresh();
    } catch (err) {
      alert(err instanceof ApiClientError ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Billing" subtitle="Monthly billing records — full CRUD">
      <div className="mb-4 flex justify-end">
        <Link href="/billing/new"><Button>+ Add Billing</Button></Link>
      </div>

      <Card title="Filter">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input label="CMS ID" value={cmsId} onChange={(e) => setCmsId(e.target.value)} className="flex-1" />
          <div className="flex items-end sm:shrink-0">
            <Button className="w-full sm:w-auto" onClick={() => setAppliedCmsId(cmsId)}>Filter</Button>
          </div>
        </div>
      </Card>

      {error && <Alert type="error" message={error} className="mt-4" />}

      <Card title={`Billing Records (${pagination.total})`} className="mt-6">
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
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
                      <td className="py-2 pr-4">{b.cmsId}</td>
                      <td className="py-2 pr-4">{b.name || "-"}</td>
                      <td className="py-2 pr-4">{b.voucherMonth} {b.voucherYear}</td>
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

      <ConfirmDialog open={!!deleteTarget} title="Delete Billing" message="Delete this billing record?" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </DashboardLayout>
  );
}
