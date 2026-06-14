"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../ui/Card";
import { formatCompactPKR, formatPKR } from "@/lib/chartUtils";
import type { DashboardStats } from "@/lib/types";

export function BillingTrendChart({ data }: { data: DashboardStats["billing"]["monthlyTrend"] }) {
  if (!data.length) {
    return (
      <Card title="Monthly Billing Trend" subtitle="Total bill, paid, and balance by voucher period">
        <p className="py-12 text-center text-sm text-slate-500">
          No monthly billing data yet. Upload a Monthly Billing Excel file to see trends.
        </p>
      </Card>
    );
  }

  return (
    <Card title="Monthly Billing Trend" subtitle="Total bill, paid, and balance by voucher period">
      <div className="h-72 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#64748b" }} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => formatCompactPKR(Number(v))} width={72} />
            <Tooltip
              formatter={(value) => formatPKR(Number(value))}
              contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="totalBill" name="Total Bill" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="paid" name="Paid" fill="#059669" radius={[4, 4, 0, 0]} />
            <Bar dataKey="balance" name="Balance" fill="#dc2626" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
