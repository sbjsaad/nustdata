"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "../ui/Card";
import { CHART_COLORS } from "@/lib/chartUtils";
import { CATEGORY_LABELS } from "@/lib/types";

export function CategoryPieChart({
  byCategory,
}: {
  byCategory: Record<string, number>;
}) {
  const data = Object.entries(CATEGORY_LABELS).map(([code, label]) => ({
    name: code,
    label,
    value: byCategory[code] || 0,
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!total) {
    return (
      <Card title="Students by Category" subtitle="NS, GC, PC, AES distribution">
        <p className="py-12 text-center text-sm text-slate-500">No student records yet.</p>
      </Card>
    );
  }

  return (
    <Card title="Students by Category" subtitle="NS, GC, PC, AES distribution">
      <div className="h-64 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={84}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, _name, item) => [
                `${value} students (${Math.round((Number(value) / total) * 100)}%)`,
                `${item.payload.name} — ${item.payload.label}`,
              ]}
              contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-xs text-slate-600">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            <span>
              {item.name}: <strong className="text-slate-900">{item.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
