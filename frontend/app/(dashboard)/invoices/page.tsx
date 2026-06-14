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
import type { Invoice } from "@/lib/types";

export default function InvoicesPage() {
  const [cmsId, setCmsId] = useState("");
  const [appliedCmsId, setAppliedCmsId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filters = useMemo(() => ({ cmsId: appliedCmsId }), [appliedCmsId]);
  const { items, pagination, loading, error, setPage, setLimit, refresh } =
    usePaginatedFetch<Invoice>({ endpoint: "/invoices", listKey: "invoices", filters });

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    try {
      await api.delete(`/invoices/${deleteTarget._id}`);
      setDeleteTarget(null);
      refresh();
    } catch (err) {
      alert(err instanceof ApiClientError ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Invoices" subtitle="Invoice and voucher records — full CRUD">
      <div className="mb-4 flex justify-end">
        <Link href="/invoices/new"><Button>+ Add Invoice</Button></Link>
      </div>

      <Card title="Filter">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input label="CMS ID / Reg No" value={cmsId} onChange={(e) => setCmsId(e.target.value)} className="flex-1" />
          <div className="flex items-end sm:shrink-0">
            <Button className="w-full sm:w-auto" onClick={() => setAppliedCmsId(cmsId)}>Filter</Button>
          </div>
        </div>
      </Card>

      {error && <Alert type="error" message={error} className="mt-4" />}

      <Card title={`Invoices (${pagination.total})`} className="mt-6">
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-2 pr-4">Invoice No</th>
                    <th className="py-2 pr-4">Reg No</th>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Month/Year</th>
                    <th className="py-2 pr-4">Balance</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((inv) => (
                    <tr key={inv._id} className="border-b border-slate-100">
                      <td className="py-2 pr-4">{inv.invoiceNo || "-"}</td>
                      <td className="py-2 pr-4">{inv.regNo}</td>
                      <td className="py-2 pr-4">{inv.name || "-"}</td>
                      <td className="py-2 pr-4">{inv.voucherMonth} {inv.voucherYear}</td>
                      <td className="py-2 pr-4 text-red-600">{inv.balance}</td>
                      <td className="py-2">
                        <ActionGroup>
                          <ActionLink href={`/invoices/${inv._id}`} label="View" />
                          <ActionLink href={`/invoices/${inv._id}/edit`} label="Edit" variant="edit" />
                          <ActionLink label="Delete" variant="delete" onClick={() => setDeleteTarget(inv)} />
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

      <ConfirmDialog open={!!deleteTarget} title="Delete Invoice" message="Delete this invoice?" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </DashboardLayout>
  );
}
