"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../ui/Card";
import { formatPKR } from "@/lib/chartUtils";
import type { DashboardStats } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  success: "#059669",
  partial: "#d97706",
  failed: "#dc2626",
};

export function UploadStatusChart({
  summary,
  total,
}: {
  summary: Record<string, number>;
  total: number;
}) {
  const data = Object.entries(summary).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    fill: STATUS_COLORS[status] || "#64748b",
  }));

  if (!total) {
    return (
      <Card title="Upload Activity" subtitle="Excel import results by status">
        <p className="py-12 text-center text-sm text-slate-500">No uploads yet.</p>
      </Card>
    );
  }

  return (
    <Card title="Upload Activity" subtitle="Excel import results by status">
      <div className="h-52 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="status" tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} width={32} />
            <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", fontSize: 12 }} />
            <Bar dataKey="count" name="Uploads" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-center text-sm text-slate-500">{total} total uploads</p>
    </Card>
  );
}

export function ManualChargesChart({ charges }: { charges: DashboardStats["charges"] }) {
  const data = charges.byType.filter((item) => item.amount > 0);

  if (!data.length) {
    return (
      <Card title="Manual Charges" subtitle="Charges added through the Charges module">
        <p className="py-12 text-center text-sm text-slate-500">No manual charges recorded yet.</p>
      </Card>
    );
  }

  return (
    <Card title="Manual Charges" subtitle="Charges added through the Charges module">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-indigo-50 p-3">
          <p className="text-xs text-indigo-700">Total Entries</p>
          <p className="text-xl font-bold text-indigo-900">{charges.totalEntries}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3">
          <p className="text-xs text-emerald-700">Total Amount</p>
          <p className="text-xl font-bold text-emerald-900">{formatPKR(charges.totalAmount)}</p>
        </div>
      </div>
      <div className="h-48 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`} width={40} />
            <Tooltip formatter={(value) => formatPKR(Number(value))} contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", fontSize: 12 }} />
            <Bar dataKey="amount" name="Amount" fill="#7c3aed" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
