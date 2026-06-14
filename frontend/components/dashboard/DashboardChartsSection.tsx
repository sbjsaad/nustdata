"use client";

import { BillingTrendChart } from "./BillingTrendChart";
import { PaymentOverviewChart } from "./PaymentOverviewChart";
import { CategoryPieChart } from "./CategoryPieChart";
import { StudentTypeChart } from "./StudentTypeChart";
import { ChargeBreakdownChart } from "./ChargeBreakdownChart";
import { ManualChargesChart, UploadStatusChart } from "./UploadStatusChart";
import type { DashboardStats } from "@/lib/types";

export default function DashboardChartsSection({
  stats,
}: {
  stats: DashboardStats;
}) {
  return (
    <>
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
    </>
  );
}
