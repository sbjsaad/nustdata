"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ActionGroup, ActionLink } from "@/components/ui/ActionLink";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { api, ApiClientError } from "@/lib/api";
import { CATEGORY_LABELS, type Category, type PaginationMeta } from "@/lib/types";

const defaultPagination: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError("");

    try {
      const data = await api.get<Record<string, unknown>>(`/categories?page=${page}&limit=${limit}`);
      setCategories((data.categories as Category[]) || []);
      setPagination({
        page: data.page as number,
        limit: data.limit as number,
        total: data.total as number,
        totalPages: data.totalPages as number,
        hasNextPage: data.hasNextPage as boolean,
        hasPrevPage: data.hasPrevPage as boolean,
      });
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await api.get<Record<string, unknown>>("/categories?page=1&limit=10");
        if (cancelled) return;

        setCategories((data.categories as Category[]) || []);
        setPagination({
          page: data.page as number,
          limit: data.limit as number,
          total: data.total as number,
          totalPages: data.totalPages as number,
          hasNextPage: data.hasNextPage as boolean,
          hasPrevPage: data.hasPrevPage as boolean,
        });
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiClientError ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/categories/${deleteTarget.code}`);
      setDeleteTarget(null);
      fetchCategories(pagination.page, pagination.limit);
    } catch (err) {
      alert(err instanceof ApiClientError ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Categories" subtitle="NS, GC, PC, AES — create, update, delete">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title={editing ? `Edit ${editing.code}` : "Create Category"}>
          <CategoryForm
            mode={editing ? "edit" : "create"}
            initial={editing || undefined}
            code={editing?.code}
            onSuccess={() => {
              setEditing(null);
              fetchCategories(pagination.page, pagination.limit);
            }}
          />
          {editing && (
            <button className="mt-3 text-sm text-slate-500 hover:underline" onClick={() => setEditing(null)}>
              Cancel edit
            </button>
          )}
        </Card>

        <Card title={`All Categories (${pagination.total})`}>
          {error && <Alert type="error" message={error} className="mb-4" />}
          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : (
            <>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat.code} className="rounded-lg border border-slate-100 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {cat.code} — {CATEGORY_LABELS[cat.code] || cat.name}
                        </h4>
                        <p className="mt-1 text-sm text-slate-600">{cat.description}</p>
                        <p className="mt-2 text-xs text-slate-500">{cat.chargeHeads.join(" · ")}</p>
                      </div>
                      <ActionGroup>
                        <ActionLink label="Edit" variant="edit" onClick={() => setEditing(cat)} />
                        <ActionLink label="Delete" variant="delete" onClick={() => setDeleteTarget(cat)} />
                      </ActionGroup>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination
                {...pagination}
                onPageChange={(p) => fetchCategories(p, pagination.limit)}
                onLimitChange={(l) => fetchCategories(1, l)}
              />
            </>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Category"
        message={`Deactivate category ${deleteTarget?.code}?`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
}
