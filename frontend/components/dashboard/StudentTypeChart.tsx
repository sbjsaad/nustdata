"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "../ui/Card";
import { STUDENT_TYPE_LABELS } from "@/lib/types";

const TYPE_COLORS = {
  boarder: "#4f46e5",
  day_scholar: "#059669",
};

export function StudentTypeChart({
  byType,
}: {
  byType: Record<string, number>;
}) {
  const data = Object.entries(STUDENT_TYPE_LABELS).map(([key, label]) => ({
    key,
    name: label,
    value: byType[key] || 0,
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!total) {
    return (
      <Card title="Students by Type" subtitle="Boarders vs Day Scholars">
        <p className="py-12 text-center text-sm text-slate-500">No student records yet.</p>
      </Card>
    );
  }

  return (
    <Card title="Students by Type" subtitle="Boarders vs Day Scholars">
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
              paddingAngle={4}
            >
              {data.map((entry) => (
                <Cell key={entry.key} fill={TYPE_COLORS[entry.key as keyof typeof TYPE_COLORS]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} students`, "Count"]}
              contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 space-y-2">
        {data.map((item) => (
          <div key={item.key} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: TYPE_COLORS[item.key as keyof typeof TYPE_COLORS] }}
              />
              {item.name}
            </div>
            <span className="font-semibold text-slate-900">
              {item.value} ({Math.round((item.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
