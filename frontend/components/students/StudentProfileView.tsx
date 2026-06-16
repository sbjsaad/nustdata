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

function formatNumber(val?: number) {
  if (val == null || val === 0) return "—";
  return val.toLocaleString();
}

export function StudentProfileView({ profile }: { profile: StudentProfile }) {
  const { student, billings, invoices, charges, chargeSummary, totals } = profile;
  
  const displayCategory = student.category === "AES" ? "ASC" : student.category;

  const rowsData = billings.length > 0
    ? billings
    : [{
        _id: "dummy",
        cmsId: student.cmsId,
        charges: {},
        totalBill: 0,
        paid: 0,
        balance: 0,
        voucherMonth: "—",
        voucherYear: "",
        lateFeeFine: 0
      } as Billing];

  return (
    <div className="space-y-6">
      {/* Student Basic Information Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Student Profile</p>
        <h1 className="mt-1.5 text-xl font-extrabold text-slate-950 sm:text-2xl md:text-3xl tracking-tight">
          {displayCategory}-{student.de || "—"} <span className="text-slate-300 font-normal">|</span> {student.cmsId} <span className="text-slate-300 font-normal">|</span> {student.name}
        </h1>
      </div>

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

      {/* Tabular Excel Sheet View of Student Record */}
      <Card title={`Student Billing Record Spreadsheet (Excel View)`} className="overflow-hidden">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-inner max-w-full">
          <table className="w-full text-left border-collapse text-xs font-medium text-slate-700 min-w-[2000px]">
            <thead>
              {/* Row 1 Header */}
              <tr className="border-b border-slate-200 bg-slate-100/80 text-[11px] font-bold uppercase tracking-wider text-slate-600 select-none">
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Ser</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Cat</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>DE</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Discp</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>CMS ID</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Name</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Father Name</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Father OCC</th>
                <th className="px-3 py-2 border-r border-slate-200 text-center" colSpan={2}>Contact No</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Email Address</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Gender</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Loc</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center bg-indigo-50/50" rowSpan={2}>Month/Year</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Arrear</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Six Month Fix Charges</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Security H/M</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>W&R Contribution</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Messing</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Fine</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Utility Bill Accn/Mess</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Sports Charges</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>UMS Charges</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Convo Charges 1st Inst DE-44</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Outfit Items DE-47</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Dhobi U/Wash</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Laundry Charges</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Degree Charges</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Processing Fees</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center" rowSpan={2}>Late Fee Fine</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center bg-amber-50" rowSpan={2}>Total Bill</th>
                <th className="px-3 py-2.5 border-r border-slate-200 text-center bg-green-50" rowSpan={2}>Paid</th>
                <th className="px-3 py-2.5 text-center bg-red-50" rowSpan={2}>Balance</th>
              </tr>
              {/* Row 2 Header for Contact No */}
              <tr className="border-b border-slate-200 bg-slate-100/80 text-[10px] font-bold uppercase tracking-wider text-slate-500 select-none">
                <th className="px-2 py-1.5 border-r border-slate-200 text-center">Student</th>
                <th className="px-2 py-1.5 border-r border-slate-200 text-center">Parents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rowsData.map((row, idx) => {
                const isDummy = row._id === "dummy";
                const serial = idx + 1;
                
                return (
                  <tr key={row._id} className="hover:bg-slate-50 transition-colors whitespace-nowrap">
                    <td className="px-3 py-2.5 border-r border-slate-100 text-center font-semibold text-slate-500">{student.sNo || serial}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-center font-bold">{displayCategory}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-center font-semibold">{student.de || "—"}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-center">{student.discipline || "—"}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-center font-bold text-slate-900">{student.cmsId}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 font-bold text-slate-900">{student.name}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100">{student.fatherName || "—"}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100">{student.fatherOccupation || "—"}</td>
                    <td className="px-2 py-2.5 border-r border-slate-100 text-center font-mono text-slate-600">{student.contactNumber || "—"}</td>
                    <td className="px-2 py-2.5 border-r border-slate-100 text-center font-mono text-slate-600">{student.parentContactNumber || "—"}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-slate-600">{student.email || "—"}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-center">{student.gender || "—"}</td>
                    <td className={`px-3 py-2.5 border-r border-slate-100 text-center font-bold ${
                      student.location === "KH" || student.location === "K/H"
                        ? "bg-yellow-300 text-yellow-950 font-extrabold" 
                        : student.location === "ASH" 
                          ? "bg-blue-900 text-blue-100 font-extrabold" 
                          : ""
                    }`}>
                      {student.location || "—"}
                    </td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-center bg-indigo-50/30 font-semibold text-slate-900">
                      {isDummy ? "—" : `${row.voucherMonth || ""} ${row.voucherYear || ""}`.trim()}
                    </td>
                    
                    {/* Billing Charges numeric values */}
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono">{isDummy ? "—" : formatNumber(row.charges?.arrear)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono">{isDummy ? "—" : formatNumber(row.charges?.sixMonthFixCharges)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono">{isDummy ? "—" : formatNumber(row.charges?.securityHM)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono">{isDummy ? "—" : formatNumber(row.charges?.wrContribution)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono font-bold text-slate-900">{isDummy ? "—" : formatNumber(row.charges?.messingCharges)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono">{isDummy ? "—" : formatNumber(row.charges?.fine)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono">{isDummy ? "—" : formatNumber(row.charges?.utilityBillAccnMess)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono">{isDummy ? "—" : formatNumber(row.charges?.sportsCharges)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono">{isDummy ? "—" : formatNumber(row.charges?.umsCharges)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono">{isDummy ? "—" : formatNumber(row.charges?.convoChargesDE44)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono">{isDummy ? "—" : formatNumber(row.charges?.outfitItemsDE47)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono">{isDummy ? "—" : formatNumber(row.charges?.dhobiUWash)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono">{isDummy ? "—" : formatNumber(row.charges?.laundryCharges)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono">{isDummy ? "—" : formatNumber(row.charges?.degreeCharges)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono">{isDummy ? "—" : formatNumber(row.charges?.processingFees)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right font-mono text-amber-700">{isDummy ? "—" : formatNumber(row.lateFeeFine)}</td>
                    
                    {/* Summary Bill Values */}
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right bg-amber-50/50 font-bold text-slate-900">{isDummy ? "—" : formatNumber(row.totalBill)}</td>
                    <td className="px-3 py-2.5 border-r border-slate-100 text-right bg-green-50/50 font-bold text-green-700">{isDummy ? "—" : formatNumber(row.paid)}</td>
                    <td className="px-3 py-2.5 text-right bg-red-50/50 font-bold text-red-600">{isDummy ? "—" : formatNumber(row.balance)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {student.isDerived && (
          <div className="mt-3 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-100/50">
            ℹ️ Profile derived from billing data (not in student master)
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
