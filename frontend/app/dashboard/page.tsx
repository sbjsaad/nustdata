"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { BillingTrendChart } from "@/components/dashboard/BillingTrendChart";
import { PaymentOverviewChart } from "@/components/dashboard/PaymentOverviewChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { StudentTypeChart } from "@/components/dashboard/StudentTypeChart";
import { ChargeBreakdownChart } from "@/components/dashboard/ChargeBreakdownChart";
import { ManualChargesChart, UploadStatusChart } from "@/components/dashboard/UploadStatusChart";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { api, ApiClientError } from "@/lib/api";
import { formatPKR } from "@/lib/chartUtils";
import type { DashboardStats } from "@/lib/types";

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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<DashboardStats>("/dashboard/stats")
      .then(setStats)
      .catch((err) =>
        setError(err instanceof ApiClientError ? err.message : "Failed to load dashboard")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Billing overview, student stats, and collection trends"
    >
      {error && <Alert type="error" message={error} className="mb-6" />}

      {loading ? (
        <DashboardSkeleton />
      ) : stats ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Students"
              value={stats.students.total}
              subtitle="All categories"
              icon={<span>🎓</span>}
            />
            <StatCard
              title="Billing Records"
              value={stats.billing.totalRecords}
              subtitle={`${stats.billing.collectionRate}% collection rate`}
              icon={<span>📋</span>}
            />
            <StatCard
              title="Outstanding Balance"
              value={formatPKR(stats.billing.totalBalance)}
              subtitle="Unpaid amount"
              icon={<span>💳</span>}
            />
            <StatCard
              title="Total Collected"
              value={formatPKR(stats.billing.totalPaid)}
              subtitle={`${stats.invoices.total} invoices on file`}
              icon={<span>✅</span>}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <BillingTrendChart data={stats.billing.monthlyTrend} />
            </div>
            <PaymentOverviewChart
              totalPaid={stats.billing.totalPaid}
              totalBalance={stats.billing.totalBalance}
              collectionRate={stats.billing.collectionRate}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <CategoryPieChart byCategory={stats.students.byCategory} />
            <StudentTypeChart byType={stats.students.byType} />
            <ChargeBreakdownChart data={stats.billing.chargeBreakdown} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ManualChargesChart charges={stats.charges} />
            <UploadStatusChart summary={stats.uploads.summary} total={stats.uploads.total} />
          </div>

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
                      <th className="py-2 pr-4">Created</th>
                      <th className="py-2 pr-4">Updated</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUploads.map((log) => (
                      <tr key={log.batchId} className="border-b border-slate-100">
                        <td className="max-w-[180px] truncate py-2 pr-4">{log.fileName}</td>
                        <td className="py-2 pr-4 capitalize">{log.sheetType.replace(/_/g, " ")}</td>
                        <td className="py-2 pr-4 text-green-600">{log.created}</td>
                        <td className="py-2 pr-4 text-blue-600">{log.updated}</td>
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
