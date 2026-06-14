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
import { CHART_COLORS, formatCompactPKR, formatPKR } from "@/lib/chartUtils";

export function ChargeBreakdownChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  if (!data.length) {
    return (
      <Card title="Billing Charge Breakdown" subtitle="Totals from uploaded monthly billing sheets">
        <p className="py-12 text-center text-sm text-slate-500">
          No charge breakdown data yet. Upload monthly billing records to see this chart.
        </p>
      </Card>
    );
  }

  return (
    <Card title="Billing Charge Breakdown" subtitle="Totals from uploaded monthly billing sheets">
      <div className="h-64 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => formatCompactPKR(Number(v))} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} width={88} />
            <Tooltip
              formatter={(value) => formatPKR(Number(value))}
              contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", fontSize: 12 }}
            />
            <Bar dataKey="value" name="Amount" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
