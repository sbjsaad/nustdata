"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { api, ApiClientError } from "@/lib/api";
import { formatPKR } from "@/lib/chartUtils";
import { CATEGORY_LABELS, type DashboardStats, type StudentCategory } from "@/lib/types";

const CATEGORY_ORDER = ["NS", "AES", "PC", "GC"] as const;

function categoryDisplayLabel(code: (typeof CATEGORY_ORDER)[number]) {
  return code === "AES" ? "ASC" : code;
}

function getCategoryStats(
  byCategory: Record<string, { totalBilled?: number; totalPaid?: number; totalBalance?: number; billed?: number; paid?: number; balance?: number }>,
  code: (typeof CATEGORY_ORDER)[number]
) {
  return byCategory[code] || byCategory[categoryDisplayLabel(code)] || byCategory[code === "AES" ? "ASC" : code];
}

const DashboardChartsSection = dynamic(
  () => import("@/components/dashboard/DashboardChartsSection"),
  {
    loading: () => (
      <div className="animate-pulse space-y-6">
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="h-80 rounded-xl bg-slate-200 xl:col-span-2" />
          <div className="h-80 rounded-xl bg-slate-200" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 rounded-xl bg-slate-200" />
          ))}
        </div>
      </div>
    ),
  }
);

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-slate-200" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 rounded-xl bg-slate-200 lg:col-span-2" />
        <div className="h-80 rounded-xl bg-slate-200" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-72 rounded-xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category")?.toUpperCase() || "";
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");

    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    api
      .get<DashboardStats>(`/dashboard/stats${query}`)
      .then(setStats)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : "Failed to load dashboard")
      )
      .finally(() => setLoading(false));
  }, [category]);

  const categoryLabel = category ? CATEGORY_LABELS[category as StudentCategory] || category : "All Categories";
  const billingPeriodLabel = (stats?.billing.monthlyTrend?.length
    ? stats.billing.monthlyTrend[stats.billing.monthlyTrend.length - 1].period
    : "January 2026"
  )?.replace("January 2026", "JAN-26") || "JAN-26";

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle={`Billing overview, student stats, and collection trends${category ? ` for ${categoryLabel}` : ""}`}
    >
      {error && <Alert type="error" message={error} className="mb-6" />}

      {loading ? (
        <DashboardSkeleton />
      ) : stats ? (
        <div className="space-y-6">
          {category && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
              Showing dashboard totals for {categoryLabel}
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            <span className="mt-1 block text-lg font-semibold text-red-600">
              {billingPeriodLabel}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Students"
              value={stats.students.total}
              subtitle={category ? `${categoryLabel} students` : "All categories"}
              variant="emerald"
              breakdown={(() => {
                return CATEGORY_ORDER.map((code) => ({
                  code,
                  label: categoryDisplayLabel(code),
                  value: stats.students.byCategory[code] || 0,
                }));
              })()}
              icon={<span>🎓</span>}
            />
            <StatCard
              title="Total Amount Generated"
              value={formatPKR(stats.billing.totalBilled ?? 0)}
              subtitle="Total billed amount"
              variant="amber"
              breakdown={(() => {
                const byCat = stats.billing.byCategory || {};
                return CATEGORY_ORDER.map((code) => ({
                  code,
                  label: categoryDisplayLabel(code),
                  value: formatPKR(byCat[code]?.totalBilled ?? byCat[code]?.billed ?? 0),
                }));
              })()}
              icon={<span>📋</span>}
            />
            <StatCard
              title="Amount Paid"
              value={formatPKR(stats.billing.totalPaid ?? 0)}
              subtitle="Paid amount by category"
              trend={(() => {
                const byCount = stats.billing.payingStudentsByCategory || {};
                return CATEGORY_ORDER.map((code) =>
                  `${categoryDisplayLabel(code)}: ${byCount[code] ?? 0} Stds`
                ).join(" ");
              })()}
              variant="sky"
              breakdown={(() => {
                const byCat = stats.billing.byCategory || {};
                return CATEGORY_ORDER.map((code) => ({
                  code,
                  label: categoryDisplayLabel(code),
                  value: formatPKR(byCat[code]?.totalPaid ?? byCat[code]?.paid ?? 0),
                }));
              })()}
              icon={<span>💳</span>}
            />
            <StatCard
              title="Outstanding Balance"
              value={formatPKR(stats.billing.totalBalance ?? 0)}
              subtitle="Balance by category"
              trend={(() => {
                const byCount = stats.billing.balanceStudentsByCategory || {};
                return CATEGORY_ORDER.map((code) =>
                  `${categoryDisplayLabel(code)}: ${byCount[code] ?? 0} Stds`
                ).join(" ");
              })()}
              variant="rose"
              breakdown={(() => {
                const byCat = stats.billing.byCategory || {};
                return CATEGORY_ORDER.map((code) => ({
                  code,
                  label: categoryDisplayLabel(code),
                  value: formatPKR(getCategoryStats(byCat, code)?.totalBalance ?? getCategoryStats(byCat, code)?.balance ?? 0),
                }));
              })()}
              icon={<span>✅</span>}
            />
          </div>

          <DashboardChartsSection stats={stats} />

          <Card title="Recent Uploads">
            {!stats.recentUploads?.length ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500">No uploads yet.</p>
                <Link
                  href="/upload"
                  className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Upload your first Excel file →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="py-2 pr-4">File</th>
                      <th className="py-2 pr-4">Type</th>
                      <th className="py-2 pr-4">Rows</th>
                      <th className="py-2 pr-4">Saved</th>
                      <th className="py-2 pr-4">Rejected</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUploads.map((log) => (
                      <tr key={log.batchId} className="border-b border-slate-100">
                        <td className="max-w-[180px] truncate py-2 pr-4">{log.fileName}</td>
                        <td className="py-2 pr-4 capitalize">{log.sheetType.replace(/_/g, " ")}</td>
                        <td className="py-2 pr-4">{log.totalRows}</td>
                        <td className="py-2 pr-4 text-green-600">{log.created + log.updated}</td>
                        <td className="py-2 pr-4 text-amber-600">{log.rejected ?? 0}</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              log.status === "success"
                                ? "bg-green-100 text-green-700"
                                : log.status === "partial"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2">
                          {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/upload"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Upload Excel
            </Link>
            <Link
              href="/charges"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Add Charges
            </Link>
            <Link
              href="/students"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View Students
            </Link>
            <Link
              href="/billing"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View Billing
            </Link>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
