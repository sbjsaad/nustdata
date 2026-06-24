import { type ReactNode } from "react";

interface BreakdownItem {
  code: string;
  label: string;
  value: string | number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: string;
  breakdown?: BreakdownItem[];
  variant?: "slate" | "emerald" | "amber" | "sky" | "rose";
}

const variantStyles: Record<NonNullable<StatCardProps["variant"]>, { shell: string; title: string; value: string; icon: string; breakdownLabel: string; breakdownValue: string }> = {
  slate: {
    shell: "border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100",
    title: "text-slate-500",
    value: "text-slate-950",
    icon: "bg-slate-900/5 text-slate-700",
    breakdownLabel: "text-slate-900",
    breakdownValue: "text-slate-500",
  },
  emerald: {
    shell: "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50",
    title: "text-emerald-700",
    value: "text-emerald-950",
    icon: "bg-emerald-600/10 text-emerald-700",
    breakdownLabel: "text-emerald-950",
    breakdownValue: "text-emerald-700",
  },
  amber: {
    shell: "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50",
    title: "text-amber-700",
    value: "text-amber-950",
    icon: "bg-amber-600/10 text-amber-700",
    breakdownLabel: "text-amber-950",
    breakdownValue: "text-amber-700",
  },
  sky: {
    shell: "border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50",
    title: "text-sky-700",
    value: "text-sky-950",
    icon: "bg-sky-600/10 text-sky-700",
    breakdownLabel: "text-sky-950",
    breakdownValue: "text-sky-700",
  },
  rose: {
    shell: "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-pink-50",
    title: "text-rose-700",
    value: "text-rose-950",
    icon: "bg-rose-600/10 text-rose-700",
    breakdownLabel: "text-rose-950",
    breakdownValue: "text-rose-700",
  },
};

export function StatCard({ title, value, subtitle, icon, trend, breakdown, variant = "slate" }: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5 sm:p-5 ${styles.shell}`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className={`text-sm font-semibold tracking-wide ${styles.title}`}>{title}</p>
          <p className={`mt-2 text-xl font-black tracking-tight sm:text-2xl ${styles.value}`}>{value === 0 || value === '0' ? '0' : value ?? '—'}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
          {trend && <p className="mt-2 text-xs font-medium text-slate-600">{trend}</p>}
        </div>
        {icon && (
          <div className={`rounded-2xl p-2.5 ${styles.icon}`}>{icon}</div>
        )}
      </div>
      {breakdown && breakdown.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-white/70 p-3 backdrop-blur-sm">
          {breakdown.map((b) => (
            <div key={b.code} className="flex items-baseline gap-2 text-xs">
              <span className={`font-semibold ${styles.breakdownLabel}`}>{b.label || b.code}</span>
              <span className={styles.breakdownValue}>{b.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
