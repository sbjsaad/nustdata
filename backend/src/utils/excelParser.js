import * as XLSX from "xlsx";
import { ApiError } from "./apiError.js";

export function normalizeHeader(header) {
  if (header == null) return "";
  return String(header)
    .trim()
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function parseNumber(value) {
  if (value == null || value === "") return 0;
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/,/g, "").trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
}

export function parseDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) return new Date(parsed.y, parsed.m - 1, parsed.d);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function readExcelBuffer(buffer) {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new ApiError(400, "Excel file has no sheets");
    }
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
    if (!rows.length) {
      throw new ApiError(400, "Excel sheet is empty");
    }
    return rows;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "Failed to parse Excel file", error.message);
  }
}

export function mapRow(row, columnMap) {
  const mapped = {};
  const normalizedEntries = Object.entries(row).map(([key, value]) => [
    normalizeHeader(key),
    value,
  ]);

  for (const [field, aliases] of Object.entries(columnMap)) {
    const aliasList = Array.isArray(aliases) ? aliases : [aliases];
    const match = normalizedEntries.find(([key]) =>
      aliasList.some((alias) => key === normalizeHeader(alias) || key.includes(normalizeHeader(alias)))
    );
    mapped[field] = match ? match[1] : "";
  }

  return mapped;
}

export function detectSheetType(headers) {
  const normalized = headers.map(normalizeHeader);

  const hasInvoice =
    normalized.some((h) => h.includes("invoice no")) &&
    normalized.some((h) => h.startsWith("head 1"));
  if (hasInvoice) return "invoice";

  const hasMonthly =
    normalized.some((h) => h.includes("cms id") || h.includes("cmsid")) &&
    normalized.some((h) => h.includes("laundry") || h.includes("total bill"));
  if (hasMonthly) return "monthly_billing";

  const hasStudent =
    normalized.some((h) => h.includes("reg no") || h.includes("regno")) &&
    normalized.some((h) => h.includes("father") || h.includes("contact"));
  if (hasStudent) return "student_master";

  return null;
}
