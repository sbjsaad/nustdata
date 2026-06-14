"use client";

import Link from "next/link";
import {
  CATEGORY_LABELS,
  STUDENT_TYPE_LABELS,
  CHARGE_TYPE_LABELS,
  type StudentProfile,
} from "@/lib/types";
import { Card } from "../ui/Card";

function formatCurrency(amount: number) {
  return `PKR ${amount.toLocaleString()}`;
}

function DetailRow({ label, value }: { label: string; value?: string | number }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between border-b border-slate-100 py-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}

export function StudentProfileView({ profile }: { profile: StudentProfile }) {
  const { student, billings, invoices, charges, chargeSummary, totals } = profile;

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
          <DetailRow label="CMS ID" value={student.cmsId} />
          <DetailRow label="Reg No" value={student.regNo} />
          <DetailRow label="Name" value={student.name} />
          <DetailRow label="Father Name" value={student.fatherName} />
          <DetailRow label="Category" value={CATEGORY_LABELS[student.category] || student.category} />
          <DetailRow
            label="Student Type"
            value={STUDENT_TYPE_LABELS[student.studentType] || student.studentType}
          />
          <DetailRow label="Contact" value={student.contactNumber} />
          <DetailRow label="Email" value={student.email} />
          <DetailRow label="Location" value={student.location} />
          <DetailRow label="Gender" value={student.gender} />
          {student.isDerived && (
            <p className="mt-3 text-xs text-amber-600">
              Profile derived from billing data (not in student master)
            </p>
          )}
        </Card>

        <Card title="Charge Summary">
          {Object.entries(chargeSummary)
            .filter(([key]) => key !== "total")
            .map(([type, amount]) => (
              <DetailRow
                key={type}
                label={CHARGE_TYPE_LABELS[type as keyof typeof CHARGE_TYPE_LABELS] || type}
                value={formatCurrency(amount as number)}
              />
            ))}
          <DetailRow label="Total Manual Charges" value={formatCurrency(chargeSummary.total || 0)} />
        </Card>
      </div>

      <Card title={`Monthly Billing (${billings.length})`}>
        {billings.length === 0 ? (
          <p className="text-sm text-slate-500">No billing records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-2 pr-4">Month/Year</th>
                  <th className="py-2 pr-4">Messing</th>
                  <th className="py-2 pr-4">Washing</th>
                  <th className="py-2 pr-4">Laundry</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2 pr-4">Paid</th>
                  <th className="py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {billings.map((bill) => (
                  <tr key={bill._id} className="border-b border-slate-100">
                    <td className="py-2 pr-4">
                      {bill.voucherMonth} {bill.voucherYear}
                    </td>
                    <td className="py-2 pr-4">{bill.charges?.messingCharges || 0}</td>
                    <td className="py-2 pr-4">{bill.charges?.dhobiUWash || 0}</td>
                    <td className="py-2 pr-4">{bill.charges?.laundryCharges || 0}</td>
                    <td className="py-2 pr-4">{bill.totalBill}</td>
                    <td className="py-2 pr-4 text-green-600">{bill.paid}</td>
                    <td className="py-2 text-red-600">{bill.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
