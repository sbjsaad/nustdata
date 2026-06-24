import { getStudentByCmsId, getStudentStats } from "../student/student.service.js";
import { getBillingsByCmsId, getBillingStats } from "../billing/billing.service.js";
import { getInvoicesByCmsId } from "../invoice/invoice.service.js";
import { getChargeSummaryByCmsId } from "../charge/charge.service.js";
import { getUploadLogs } from "../upload/upload.service.js";
import { Billing } from "../billing/billing.model.js";
import { ChargeEntry } from "../charge/charge.model.js";
import { Invoice } from "../invoice/invoice.model.js";
import { UploadLog } from "../upload/upload.model.js";
import { ApiError } from "../../utils/apiError.js";

const MONTH_ORDER = {
  january: 1,
  jan: 1,
  february: 2,
  feb: 2,
  march: 3,
  mar: 3,
  april: 4,
  apr: 4,
  may: 5,
  june: 6,
  jun: 6,
  july: 7,
  jul: 7,
  august: 8,
  aug: 8,
  september: 9,
  sep: 9,
  sept: 9,
  october: 10,
  oct: 10,
  november: 11,
  nov: 11,
  december: 12,
  dec: 12,
};

const CHARGE_LABELS = {
  messing: "Messing",
  washing: "Washing",
  laundry: "Laundry",
  sports: "Sports",
  security: "Security",
  processing: "Processing",
  other: "Other",
};

const BILLING_CHARGE_LABELS = {
  messing: "Messing",
  washing: "Washing",
  laundry: "Laundry",
  sports: "Sports",
  security: "Security",
  processing: "Processing",
};

function monthSortKey(month, year) {
  const normalized = String(month || "")
    .trim()
    .toLowerCase();
  const monthIndex = MONTH_ORDER[normalized] || 0;
  const yearNum = parseInt(String(year || "0"), 10) || 0;
  return yearNum * 100 + monthIndex;
}

function formatPeriod(month, year) {
  const monthLabel = String(month || "Unknown").trim();
  const yearLabel = String(year || "").trim();
  return yearLabel ? `${monthLabel} ${yearLabel}` : monthLabel;
}

async function getMonthlyBillingTrend() {
  const rows = await Billing.aggregate([
    {
      $match: {
        voucherMonth: { $nin: [null, ""] },
        voucherYear: { $nin: [null, ""] },
      },
    },
    {
      $group: {
        _id: { month: "$voucherMonth", year: "$voucherYear" },
        totalBill: { $sum: "$totalBill" },
        paid: { $sum: "$paid" },
        balance: { $sum: "$balance" },
        records: { $sum: 1 },
      },
    },
  ]);

  return rows
    .map((row) => ({
      period: formatPeriod(row._id.month, row._id.year),
      month: row._id.month,
      year: row._id.year,
      totalBill: row.totalBill || 0,
      paid: row.paid || 0,
      balance: row.balance || 0,
      records: row.records || 0,
      sortKey: monthSortKey(row._id.month, row._id.year),
    }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(-8)
    .map(({ sortKey, month, year, ...rest }) => rest);
}

async function getBillingPaidStudentCounts(query = {}) {
  const filter = {};
  if (query.category) filter.category = String(query.category).toUpperCase();

  const rows = await Billing.aggregate([
    { $match: { ...filter, paid: { $gt: 0 } } },
    { $group: { _id: { category: "$category", cmsId: "$cmsId" } } },
    { $group: { _id: "$_id.category", count: { $sum: 1 } } },
  ]);

  const counts = { NS: 0, AES: 0, PC: 0, GC: 0 };
  rows.forEach((item) => {
    const category = String(item._id || "UNKNOWN").toUpperCase();
    const key = category === "ASC" ? "AES" : category;
    if (counts[key] !== undefined) {
      counts[key] += item.count || 0;
    }
  });

  return counts;
}

async function getBillingBalanceStudentCounts(query = {}) {
  const filter = {};
  if (query.category) filter.category = String(query.category).toUpperCase();

  const rows = await Billing.aggregate([
    { $match: { ...filter, balance: { $gt: 0 } } },
    { $group: { _id: { category: "$category", cmsId: "$cmsId" } } },
    { $group: { _id: "$_id.category", count: { $sum: 1 } } },
  ]);

  const counts = { NS: 0, AES: 0, PC: 0, GC: 0 };
  rows.forEach((item) => {
    const category = String(item._id || "UNKNOWN").toUpperCase();
    const key = category === "ASC" ? "AES" : category;
    if (counts[key] !== undefined) {
      counts[key] += item.count || 0;
    }
  });

  return counts;
}

async function getBillingChargeBreakdown() {
  const [result] = await Billing.aggregate([
    {
      $group: {
        _id: null,
        messing: { $sum: "$charges.messingCharges" },
        washing: { $sum: "$charges.dhobiUWash" },
        laundry: { $sum: "$charges.laundryCharges" },
        sports: { $sum: "$charges.sportsCharges" },
        security: { $sum: "$charges.securityHM" },
        processing: { $sum: "$charges.processingFees" },
      },
    },
  ]);

  if (!result) return [];

  return Object.entries(BILLING_CHARGE_LABELS)
    .map(([key, label]) => ({
      name: label,
      value: result[key] || 0,
    }))
    .filter((item) => item.value > 0);
}

async function getManualChargeStats() {
  const [byType, totals] = await Promise.all([
    ChargeEntry.aggregate([
      {
        $group: {
          _id: "$chargeType",
          amount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]),
    ChargeEntry.aggregate([
      {
        $group: {
          _id: null,
          amount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  return {
    totalEntries: totals[0]?.count || 0,
    totalAmount: totals[0]?.amount || 0,
    byType: byType.map((item) => ({
      type: item._id,
      label: CHARGE_LABELS[item._id] || item._id,
      amount: item.amount || 0,
      count: item.count || 0,
    })),
  };
}

async function getUploadSummary() {
  const rows = await UploadLog.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  return Object.fromEntries(rows.map((row) => [row._id, row.count]));
}

export async function getDashboardStats(query = {}) {
  const [
    studentStats,
    billingStats,
    recentUploads,
    monthlyTrend,
    chargeBreakdown,
    payingStudentsByCategory,
    balanceStudentsByCategory,
    manualCharges,
    uploadSummary,
    invoiceTotal,
  ] = await Promise.all([
    getStudentStats(query),
    getBillingStats(query),
    getUploadLogs({ limit: 5 }),
    getMonthlyBillingTrend(),
    getBillingChargeBreakdown(),
    getBillingPaidStudentCounts(query),
    getBillingBalanceStudentCounts(query),
    getManualChargeStats(),
    getUploadSummary(),
    Invoice.countDocuments(),
  ]);

  const totalBilled = billingStats.totalPaid + billingStats.totalBalance;
  const collectionRate = totalBilled > 0 ? Math.round((billingStats.totalPaid / totalBilled) * 100) : 0;

  return {
    students: studentStats,
    billing: {
      ...billingStats,
      totalBilled,
      collectionRate,
      monthlyTrend,
      chargeBreakdown,
      payingStudentsByCategory,
      balanceStudentsByCategory,
    },
    charges: manualCharges,
    invoices: { total: invoiceTotal },
    uploads: {
      summary: uploadSummary,
      total: Object.values(uploadSummary).reduce((sum, count) => sum + count, 0),
    },
    recentUploads: recentUploads.logs,
  };
}

export async function getStudentFullProfile(cmsId) {
  const id = String(cmsId).trim();
  if (!id) throw new ApiError(400, "CMS ID is required");

  let student = null;
  try {
    student = await getStudentByCmsId(id);
  } catch {
    // Student may exist only in billing/invoice data
  }

  const [billingResult, invoiceResult, charges] = await Promise.all([
    getBillingsByCmsId(id, { limit: 100 }),
    getInvoicesByCmsId(id, { limit: 100 }),
    getChargeSummaryByCmsId(id),
  ]);

  const billings = billingResult.billings;
  const invoices = invoiceResult.invoices;

  if (!student && !billings.length && !invoices.length && !charges.entries.length) {
    throw new ApiError(404, `No records found for CMS ID: ${id}`);
  }

  const latestBilling = billings[0] || null;
  const totalBalance = billings.reduce((sum, b) => sum + (b.balance || 0), 0);
  const totalPaid = billings.reduce((sum, b) => sum + (b.paid || 0), 0);

  return {
    student: student || deriveStudentFromRecords(id, billings, invoices),
    billings,
    invoices,
    charges: charges.entries,
    chargeSummary: charges.summary,
    totals: {
      totalBalance,
      totalPaid,
      totalCharges: charges.summary.total || 0,
      latestBill: latestBilling?.totalBill || 0,
    },
  };
}

function deriveStudentFromRecords(cmsId, billings, invoices) {
  const source = billings[0] || invoices[0];
  if (!source) return { cmsId, name: "Unknown", category: "NS" };

  return {
    cmsId,
    regNo: source.regNo || cmsId,
    name: source.name || "Unknown",
    fatherName: source.fatherName || "",
    fatherOccupation: source.fatherOccupation || "",
    contactNumber: source.contactNumber || source.mobileNo || "",
    parentContactNumber: source.parentContactNumber || "",
    email: source.email || source.emailId || "",
    category: source.category || "NS",
    de: source.de || "",
    discipline: source.discipline || "",
    location: source.location || "",
    gender: source.gender || "",
    studentType: "boarder",
    isDerived: true,
  };
}
