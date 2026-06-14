"use client";

import Link from "next/link";
import {
  CATEGORY_LABELS,
  STUDENT_TYPE_LABELS,
  CHARGE_TYPE_LABELS,
  type Billing,
  type StudentProfile,
} from "@/lib/types";
import {
  BILLING_CHARGE_FIELDS,
  formatChargeAmount,
  formatDisplayValue,
} from "@/lib/billingFields";
import { Card } from "../ui/Card";

function formatCurrency(amount: number) {
  return `PKR ${amount.toLocaleString()}`;
}

function DetailRow({
  label,
  value,
  alwaysShow = false,
}: {
  label: string;
  value?: string | number | null;
  alwaysShow?: boolean;
}) {
  if (!alwaysShow && value !== 0 && !value) return null;
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-900">
        {value === 0 ? "0" : formatDisplayValue(value)}
      </span>
    </div>
  );
}

function BillingRecordCard({ bill }: { bill: Billing }) {
  const depositDate = bill.dateOfBillsDeposited
    ? new Date(bill.dateOfBillsDeposited).toLocaleDateString()
    : "—";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <p className="font-semibold text-slate-900">
            {bill.voucherMonth || "Billing"} {bill.voucherYear || ""}
          </p>
          <p className="text-xs text-slate-500">
            Ser {bill.ser || "—"} · {bill.category || "—"} · Deposited {depositDate}
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="font-semibold text-slate-900">{formatCurrency(bill.totalBill || 0)}</p>
          <p className="text-green-600">Paid {formatCurrency(bill.paid || 0)}</p>
          <p className="text-red-600">Balance {formatCurrency(bill.balance || 0)}</p>
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
        {BILLING_CHARGE_FIELDS.map(({ key, label }) => (
          <DetailRow
            key={key}
            label={label}
            value={formatChargeAmount(bill.charges?.[key])}
            alwaysShow
          />
        ))}
        <DetailRow label="Late Fee Fine" value={formatChargeAmount(bill.lateFeeFine)} alwaysShow />
      </div>
    </div>
  );
}

export function StudentProfileView({ profile }: { profile: StudentProfile }) {
  const { student, billings, invoices, charges, chargeSummary, totals } = profile;
  const latestBilling = billings[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="!p-4">
          <p className="text-xs text-slate-500">Total Balance</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(totals.totalBalance)}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs text-slate-500">Total Paid</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(totals.totalPaid)}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs text-slate-500">Manual Charges</p>
          <p className="text-xl font-bold text-indigo-600">{formatCurrency(totals.totalCharges)}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs text-slate-500">Latest Bill</p>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(totals.latestBill)}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Student Information">
          <DetailRow label="Ser" value={student.sNo} alwaysShow />
          <DetailRow label="Cat" value={student.category} alwaysShow />
          <DetailRow label="DE" value={student.de} alwaysShow />
          <DetailRow label="Discp" value={student.discipline} alwaysShow />
          <DetailRow label="CMS ID" value={student.cmsId} alwaysShow />
          <DetailRow label="Reg No" value={student.regNo} alwaysShow />
          <DetailRow label="Name" value={student.name} alwaysShow />
          <DetailRow label="Father Name" value={student.fatherName} alwaysShow />
          <DetailRow label="Father OCC" value={student.fatherOccupation} alwaysShow />
          <DetailRow
            label="Category"
            value={CATEGORY_LABELS[student.category] || student.category}
            alwaysShow
          />
          <DetailRow
            label="Student Type"
            value={STUDENT_TYPE_LABELS[student.studentType] || student.studentType}
            alwaysShow
          />
          <DetailRow label="Contact (Student)" value={student.contactNumber} alwaysShow />
          <DetailRow label="Contact (Parent)" value={student.parentContactNumber} alwaysShow />
          <DetailRow label="Email" value={student.email} alwaysShow />
          <DetailRow label="Gender" value={student.gender} alwaysShow />
          <DetailRow label="Loc" value={student.location} alwaysShow />
          {student.isDerived && (
            <p className="mt-3 text-xs text-amber-600">
              Profile derived from billing data (not in student master)
            </p>
          )}
        </Card>

        <Card title={latestBilling ? "Latest Billing Summary" : "Billing Summary"}>
          {!latestBilling ? (
            <p className="text-sm text-slate-500">No billing records found</p>
          ) : (
            <>
              {BILLING_CHARGE_FIELDS.map(({ key, label }) => (
                <DetailRow
                  key={key}
                  label={label}
                  value={formatChargeAmount(latestBilling.charges?.[key])}
                  alwaysShow
                />
              ))}
              <DetailRow
                label="Total Bill"
                value={formatCurrency(latestBilling.totalBill || 0)}
                alwaysShow
              />
              <DetailRow
                label="Paid"
                value={formatCurrency(latestBilling.paid || 0)}
                alwaysShow
              />
              <DetailRow
                label="Late Fee Fine"
                value={formatChargeAmount(latestBilling.lateFeeFine)}
                alwaysShow
              />
              <DetailRow
                label="Balance"
                value={formatCurrency(latestBilling.balance || 0)}
                alwaysShow
              />
              <DetailRow
                label="Date of Bills Deposited"
                value={
                  latestBilling.dateOfBillsDeposited
                    ? new Date(latestBilling.dateOfBillsDeposited).toLocaleDateString()
                    : "—"
                }
                alwaysShow
              />
            </>
          )}

          {Object.keys(chargeSummary).length > 1 && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Manual Charges</p>
              {Object.entries(chargeSummary)
                .filter(([key]) => key !== "total")
                .map(([type, amount]) => (
                  <DetailRow
                    key={type}
                    label={CHARGE_TYPE_LABELS[type as keyof typeof CHARGE_TYPE_LABELS] || type}
                    value={formatCurrency(amount as number)}
                  />
                ))}
              <DetailRow
                label="Total Manual Charges"
                value={formatCurrency(chargeSummary.total || 0)}
                alwaysShow
              />
            </div>
          )}
        </Card>
      </div>

      <Card title={`Monthly Billing (${billings.length})`}>
        {billings.length === 0 ? (
          <div className="space-y-2 text-sm text-slate-500">
            <p>No billing records found</p>
            <p className="text-xs text-amber-700">
              Upload your combined Student Master Excel with billing columns from Upload Excel.
              Enter Voucher Month/Year in the form if not in the file.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {billings.map((bill) => (
              <BillingRecordCard key={bill._id} bill={bill} />
            ))}
          </div>
        )}
      </Card>

      <Card title={`Invoices (${invoices.length})`}>
        {invoices.length === 0 ? (
          <p className="text-sm text-slate-500">No invoice records found</p>
        ) : (
          <div className="space-y-4">
            {invoices.map((inv) => (
              <div key={inv._id} className="rounded-lg border border-slate-100 p-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">{inv.invoiceNo || inv.regNo}</span>
                  <span className="text-red-600">Balance: {formatCurrency(inv.balance)}</span>
                </div>
                <div className="grid gap-1 text-xs text-slate-600">
                  {inv.heads?.map((h, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{h.head}</span>
                      <span>{h.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title={`Manual Charge Entries (${charges.length})`}>
        {charges.length === 0 ? (
          <p className="text-sm text-slate-500">No manual charges added yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Month</th>
                  <th className="py-2 pr-4">Submitted By</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {charges.map((c) => (
                  <tr key={c._id} className="border-b border-slate-100">
                    <td className="py-2 pr-4">
                      {CHARGE_TYPE_LABELS[c.chargeType] || c.chargeType}
                    </td>
                    <td className="py-2 pr-4">{c.amount}</td>
                    <td className="py-2 pr-4">
                      {c.month} {c.year}
                    </td>
                    <td className="py-2 pr-4">{c.submittedBy || "-"}</td>
                    <td className="py-2">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Link
        href="/charges"
        className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Add More Charges
      </Link>
    </div>
  );
}
