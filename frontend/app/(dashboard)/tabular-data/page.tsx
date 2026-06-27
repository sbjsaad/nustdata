"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { Pagination } from "@/components/ui/Pagination";
import { ActionGroup, ActionLink } from "@/components/ui/ActionLink";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { api, ApiClientError } from "@/lib/api";
import { formatPKR } from "@/lib/chartUtils";
import { CATEGORY_LABELS, STUDENT_TYPE_LABELS, type Student, type DashboardStats } from "@/lib/types";

const CATEGORY_ITEMS = [
  { code: "NS", name: "Nursing School", variant: "amber" as const, icon: "🏥" },
  { code: "AES", name: "ASC (Army Student)", variant: "emerald" as const, icon: "🎖️" },
  { code: "PC", name: "Professional College", variant: "sky" as const, icon: "🏫" },
  { code: "GC", name: "General Category", variant: "rose" as const, icon: "👥" },
];

const variantStyles = {
  amber: {
    shell: "border-amber-200 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 hover:border-amber-400 hover:shadow-amber-100/50",
    activeShell: "border-amber-500 ring-2 ring-amber-500/50 bg-amber-50/30",
    title: "text-amber-800",
    value: "text-amber-950",
    icon: "bg-amber-100 text-amber-700",
    metricBg: "bg-amber-100/40 border-amber-100",
    label: "text-amber-800/80",
    num: "text-amber-900"
  },
  emerald: {
    shell: "border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 hover:border-emerald-400 hover:shadow-emerald-100/50",
    activeShell: "border-emerald-500 ring-2 ring-emerald-500/50 bg-emerald-50/30",
    title: "text-emerald-800",
    value: "text-emerald-950",
    icon: "bg-emerald-100 text-emerald-700",
    metricBg: "bg-emerald-100/40 border-emerald-100",
    label: "text-emerald-800/80",
    num: "text-emerald-900"
  },
  sky: {
    shell: "border-sky-200 bg-gradient-to-br from-sky-50/80 via-white to-cyan-50/50 hover:border-sky-400 hover:shadow-sky-100/50",
    activeShell: "border-sky-500 ring-2 ring-sky-500/50 bg-sky-50/30",
    title: "text-sky-800",
    value: "text-sky-950",
    icon: "bg-sky-100 text-sky-700",
    metricBg: "bg-sky-100/40 border-sky-100",
    label: "text-sky-800/80",
    num: "text-sky-900"
  },
  rose: {
    shell: "border-rose-200 bg-gradient-to-br from-rose-50/80 via-white to-pink-50/50 hover:border-rose-400 hover:shadow-rose-100/50",
    activeShell: "border-rose-500 ring-2 ring-rose-500/50 bg-rose-50/30",
    title: "text-rose-800",
    value: "text-rose-950",
    icon: "bg-rose-100 text-rose-700",
    metricBg: "bg-rose-100/40 border-rose-100",
    label: "text-rose-800/80",
    num: "text-rose-900"
  }
};

function getCategoryStats(
  byCategory: Record<string, { totalBilled?: number; totalPaid?: number; totalBalance?: number; billed?: number; paid?: number; balance?: number }> | undefined,
  code: string
) {
  if (!byCategory) return { billed: 0, paid: 0, balance: 0 };
  const data = byCategory[code] || byCategory[code === "AES" ? "ASC" : code] || byCategory[code === "ASC" ? "AES" : code];
  return {
    billed: data?.totalBilled ?? data?.billed ?? 0,
    paid: data?.totalPaid ?? data?.paid ?? 0,
    balance: data?.totalBalance ?? data?.balance ?? 0,
  };
}

function CardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse h-40 rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-8 w-8 bg-slate-200 rounded-full" />
          </div>
          <div className="h-6 w-32 bg-slate-200 rounded" />
          <div className="h-12 w-full bg-slate-200 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

function TabularDataContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Selected category state from query param (defaults to 'NS')
  const selectedCategory = searchParams.get("category")?.toUpperCase() || "NS";
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const [search, setSearch] = useState("");
  const [studentType, setStudentType] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ search: "", studentType: "" });

  // Fetch Category statistics (Billed, Paid, Student count, etc.) from dashboard API
  useEffect(() => {
    setStatsLoading(true);
    setStatsError("");
    api.get<DashboardStats>("/dashboard/stats")
      .then(setStats)
      .catch((err) => {
        setStatsError(err instanceof ApiClientError ? err.message : "Failed to load category statistics");
      })
      .finally(() => setStatsLoading(false));
  }, []);

  const handleCategorySelect = (categoryCode: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", categoryCode);
    router.push(`/tabular-data?${params.toString()}`);
  };

  const filters = useMemo(
    () => ({
      category: selectedCategory,
      search: appliedFilters.search,
      studentType: appliedFilters.studentType,
    }),
    [selectedCategory, appliedFilters]
  );

  // Fetch students for the table
  const { items, pagination, loading, error, setPage, setLimit } = usePaginatedFetch<Student>({
    endpoint: "/students",
    listKey: "students",
    initialLimit: 10,
    filters,
  });

  const applySearch = () => {
    setAppliedFilters({ search, studentType });
  };

  const clearFilters = () => {
    setSearch("");
    setStudentType("");
    setAppliedFilters({ search: "", studentType: "" });
  };

  return (
    <DashboardLayout
      title="Tabular Data"
      subtitle="Interactive category summaries and student spreadsheet records"
    >
      {statsError && <Alert type="error" message={statsError} className="mb-6" />}
      
      {/* 4 Interactive Category Cards */}
      {statsLoading ? (
        <CardsSkeleton />
      ) : stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {CATEGORY_ITEMS.map(({ code, name, variant, icon }) => {
            const isSelected = selectedCategory === code;
            const styles = variantStyles[variant];
            
            const studentCount = stats.students.byCategory[code] || 0;
            const financialStats = getCategoryStats(stats.billing.byCategory, code);
            
            return (
              <div
                key={code}
                onClick={() => handleCategorySelect(code)}
                className={`group relative rounded-2xl border p-5 shadow-sm transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1 hover:shadow-md select-none ${
                  styles.shell
                } ${isSelected ? styles.activeShell : ""}`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                  </span>
                )}
                
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className={`text-xs font-bold uppercase tracking-wider ${styles.title}`}>
                      {code === "AES" ? "ASC" : code}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">
                      {name}
                    </p>
                  </div>
                  <div className={`rounded-xl p-2 text-xl shadow-inner ${styles.icon}`}>
                    {icon}
                  </div>
                </div>
                
                <div className="mt-3 flex items-baseline gap-1.5">
                  <p className={`text-2xl font-extrabold tracking-tight ${styles.value}`}>
                    {studentCount}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">Students</p>
                </div>
                
                {/* Financial overview sub-card */}
                <div className={`mt-4 rounded-xl border p-2.5 space-y-1.5 text-[11px] font-medium backdrop-blur-sm ${styles.metricBg}`}>
                  <div className="flex justify-between">
                    <span className={styles.label}>Billed:</span>
                    <span className={`font-mono font-bold ${styles.num}`}>Rs. {formatPKR(financialStats.billed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.label}>Paid:</span>
                    <span className="font-mono font-bold text-green-700">Rs. {formatPKR(financialStats.paid)}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-slate-200 pt-1.5">
                    <span className="text-red-700 font-semibold">Balance:</span>
                    <span className="font-mono font-extrabold text-red-600">Rs. {formatPKR(financialStats.balance)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Filter and Spreadsheet Section */}
      <Card title={`Filter Directory: ${selectedCategory === "AES" ? "ASC" : selectedCategory}`} className="mt-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Input
            label="Search Student"
            placeholder="Search by Name, CMS ID, Reg No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            label="Student Type"
            value={studentType}
            onChange={(e) => setStudentType(e.target.value)}
            options={[
              { value: "", label: "All Types" },
              { value: "boarder", label: "Boarders" },
              { value: "day_scholar", label: "Day Scholars" },
            ]}
          />
          <div className="flex items-end gap-2 md:col-span-2">
            <button
              onClick={applySearch}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              Apply Filter
            </button>
            <button
              onClick={clearFilters}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </Card>

      {error && <Alert type="error" message={error} className="mt-4" />}

      {/* Tabular Registry */}
      <Card
        title={`Category ${selectedCategory === "AES" ? "ASC" : selectedCategory} - Student Registry (${pagination.total})`}
        className="mt-6"
      >
        {loading ? (
          <div className="space-y-4 py-4 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/4" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 rounded w-full" />
              ))}
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            No students found in category {selectedCategory === "AES" ? "ASC" : selectedCategory} matching the filters.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <th className="px-4 py-3">CMS ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Father's Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {items.map((s) => (
                    <tr key={s.cmsId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <Link href={`/students/${s.cmsId}`} className="text-indigo-600 hover:text-indigo-800 hover:underline">
                          {s.cmsId}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-900">{s.name}</td>
                      <td className="px-4 py-3 text-slate-500">{s.fatherName || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-800">
                          {s.category === "AES" ? "ASC" : s.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ${
                            s.studentType === "boarder"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {STUDENT_TYPE_LABELS[s.studentType] || s.studentType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ${
                            s.location === "KH" || s.location === "K/H"
                              ? "bg-amber-100 text-amber-900"
                              : s.location === "ASH"
                                ? "bg-blue-100 text-blue-900"
                                : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {s.location || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600 text-xs">{s.contactNumber || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <ActionGroup>
                          <ActionLink href={`/students/${s.cmsId}`} label="View" />
                          <ActionLink href={`/students/${s.cmsId}/edit`} label="Edit" variant="edit" />
                        </ActionGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Pagination {...pagination} onPageChange={setPage} onLimitChange={setLimit} />
            </div>
          </>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default function TabularDataPage() {
  return (
    <Suspense fallback={
      <DashboardLayout title="Tabular Data" subtitle="Loading registry...">
        <div className="py-12 text-center text-sm text-slate-500">Loading page...</div>
      </DashboardLayout>
    }>
      <TabularDataContent />
    </Suspense>
  );
}
