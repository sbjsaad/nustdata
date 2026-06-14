"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "../ui/Card";
import { formatPKR } from "@/lib/chartUtils";

export function PaymentOverviewChart({
  totalPaid,
  totalBalance,
  collectionRate,
}: {
  totalPaid: number;
  totalBalance: number;
  collectionRate: number;
}) {
  const total = totalPaid + totalBalance;

  const data = [
    { name: "Collected", value: totalPaid, color: "#059669" },
    { name: "Outstanding", value: totalBalance, color: "#dc2626" },
  ].filter((item) => item.value > 0);

  if (!total) {
    return (
      <Card title="Payment Overview" subtitle="Collected vs outstanding billing amounts">
        <p className="py-12 text-center text-sm text-slate-500">No billing amounts recorded yet.</p>
      </Card>
    );
  }

  return (
    <Card title="Payment Overview" subtitle="Collected vs outstanding billing amounts">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="relative h-56 w-56 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={82}
                paddingAngle={3}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatPKR(Number(value))}
                contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-slate-900">{collectionRate}%</p>
            <p className="text-xs text-slate-500">Collected</p>
          </div>
        </div>

        <div className="w-full flex-1 space-y-3 pt-2">
          {data.map((item) => (
            <div key={item.name} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-600">{item.name}</span>
              </div>
              <p className="mt-1 text-lg font-bold text-slate-900">{formatPKR(item.value)}</p>
              <p className="text-xs text-slate-500">
                {Math.round((item.value / total) * 100)}% of total billed
              </p>
            </div>
          ))}
          <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">Total Billed</p>
            <p className="mt-1 text-lg font-bold text-indigo-900">{formatPKR(total)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
