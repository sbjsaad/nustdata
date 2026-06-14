import { type ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: string;
}

export function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
          {trend && <p className="mt-2 text-xs font-medium text-indigo-600">{trend}</p>}
        </div>
        {icon && (
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">{icon}</div>
        )}
      </div>
    </div>
  );
}
