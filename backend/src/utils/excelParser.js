import * as XLSX from "xlsx";
import { ApiError } from "./apiError.js";

const GROUP_HEADER_LABELS = new Set(["student", "students", "parents", "parent", "guardian"]);

export function normalizeHeader(header) {
  if (header == null) return "";
  return String(header)
    .trim()
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function stripHeaderSuffix(header) {
  return String(header)
    .replace(/\s*__\d+\s*$/, "")
    .replace(/\s+\d+\s*$/, "")
    .trim();
}

export function normalizeCmsId(value) {
  if (value == null || value === "") return "";
  let str = String(value).trim();
  if (/^\d+\.0+$/.test(str)) str = str.replace(/\.0+$/, "");
  return str;
}

export function parseNumber(value) {
  if (value == null || value === "") return 0;
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/,/g, "").trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
}

const BILLING_HEADER_PATTERNS = [
  "total bill",
  "laundry",
  "messing",
  "dhobi",
  "arrear",
  "six month",
  "security h",
  "w r contribution",
  "ums charges",
  "degree charges",
  "convo charges",
  "outfit items",
  "utility bill",
  "processing fees",
  "late fee",
  "paid",
  "balance",
  "fine",
];

const STUDENT_ID_HEADER_PATTERNS = [
  "cms id",
  "cmsid",
  "cms no",
  "reg no",
  "regno",
  "roll no",
];

export function hasBillingHeaders(headers) {
  const normalized = (headers || []).map((header) =>
    normalizeHeader(stripHeaderSuffix(header))
  );
  return normalized.some((header) =>
    BILLING_HEADER_PATTERNS.some((pattern) => header.includes(pattern))
  );
}

export function hasStudentIdHeaders(headers) {
  const normalized = (headers || []).map((header) =>
    normalizeHeader(stripHeaderSuffix(header))
  );
  return normalized.some((header) =>
    STUDENT_ID_HEADER_PATTERNS.some((pattern) => header.includes(pattern))
  );
}

export function rowsHaveBillingColumns(rows) {
  if (!rows?.length) return false;
  return hasBillingHeaders(Object.keys(rows[0]));
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

function isHeaderCandidate(normalizedCells) {
  const cells = normalizedCells.filter(Boolean);
  if (cells.length < 2) return false;

  const hasRegOrCms = cells.some(
    (h) =>
      h.includes("reg no") ||
      h.includes("regno") ||
      h.includes("cms id") ||
      h.includes("cmsid") ||
      h.includes("cms no") ||
      h.includes("roll no")
  );
  const hasName = cells.some((h) => h === "name" || h.includes("student name"));
  const hasCat = cells.some((h) => h === "cat" || h.includes("category"));
  const hasBilling = cells.some(
    (h) =>
      h.includes("total bill") ||
      h.includes("laundry") ||
      h.includes("messing") ||
      h.includes("dhobi") ||
      h.includes("arrear")
  );
  const hasInvoice =
    cells.some((h) => h.includes("invoice no")) &&
    cells.some((h) => h.startsWith("head 1"));

  return hasRegOrCms || (hasName && hasCat) || hasBilling || hasInvoice;
}

function isGroupHeaderRow(normalizedCells) {
  const cells = normalizedCells.filter(Boolean);
  if (!cells.length) return false;
  return cells.every((cell) => GROUP_HEADER_LABELS.has(cell));
}

function isPartialHeaderRow(normalizedCells) {
  const cells = normalizedCells.filter(Boolean);
  if (!cells.length) return false;
  const groupOnly = cells.every(
    (cell) => GROUP_HEADER_LABELS.has(cell) || cell.length <= 2
  );
  return groupOnly && cells.some((cell) => GROUP_HEADER_LABELS.has(cell));
}

function findHeaderBlock(aoa, maxScan = 30) {
  for (let i = 0; i < Math.min(aoa.length, maxScan); i++) {
    const row = aoa[i] || [];
    const normalized = row.map((cell) => normalizeHeader(cell));
    if (!isHeaderCandidate(normalized)) continue;

    let startRow = i;
    if (i > 0) {
      const prev = (aoa[i - 1] || []).map((cell) => normalizeHeader(cell));
      if (isGroupHeaderRow(prev) || isPartialHeaderRow(prev)) {
        startRow = i - 1;
      }
    }
    if (startRow > 0) {
      const prev2 = (aoa[startRow - 1] || []).map((cell) => normalizeHeader(cell));
      if (isGroupHeaderRow(prev2)) {
        startRow -= 1;
      }
    }

    return {
      startRow,
      endRow: i,
      dataStartRow: i + 1,
    };
  }

  return { startRow: 0, endRow: 0, dataStartRow: 1 };
}

function flattenHeaderBlock(aoa, startRow, endRow) {
  const maxCols = Math.max(
    ...aoa.slice(startRow, endRow + 1).map((row) => (row || []).length),
    0
  );
  const headers = [];
  const seen = {};

  for (let col = 0; col < maxCols; col++) {
    const parts = [];

    for (let row = startRow; row <= endRow; row++) {
      const cell = String(aoa[row]?.[col] ?? "").trim();
      if (!cell) continue;

      const norm = normalizeHeader(cell);
      if (GROUP_HEADER_LABELS.has(norm) && endRow > startRow) continue;

      if (!parts.some((part) => normalizeHeader(part) === norm)) {
        parts.push(cell);
      }
    }

    let label = parts.length ? parts[parts.length - 1] : "";
    if (label) {
      const base = normalizeHeader(label);
      seen[base] = (seen[base] || 0) + 1;
      if (seen[base] > 1) {
        label = `${label} ${seen[base]}`;
      }
    }

    headers.push(label);
  }

  return headers;
}

function isSummaryDataRow(rowObj) {
  const values = Object.values(rowObj).map((v) => String(v ?? "").trim().toLowerCase());
  if (values.every((v) => !v)) return true;
  if (values.some((v) => GROUP_HEADER_LABELS.has(v))) return true;
  if (values.includes("total") || values.includes("grand total")) return true;
  return false;
}

function rowsFromSheet(sheet) {
  const aoa = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });
  if (!aoa.length) {
    throw new ApiError(400, "Excel sheet is empty");
  }

  const { startRow, endRow, dataStartRow } = findHeaderBlock(aoa);
  const headers = flattenHeaderBlock(aoa, startRow, endRow);
  const rows = [];

  for (let i = dataStartRow; i < aoa.length; i++) {
    const values = aoa[i];
    if (!values || !Array.isArray(values)) continue;

    const hasData = values.some((value) => String(value ?? "").trim() !== "");
    if (!hasData) continue;

    const row = {};
    headers.forEach((header, idx) => {
      if (!header) return;
      const value = values[idx] ?? "";
      if (row[header] !== undefined && String(row[header]).trim() !== "") {
        let duplicateIndex = 2;
        while (row[`${header}__${duplicateIndex}`] !== undefined) {
          duplicateIndex += 1;
        }
        row[`${header}__${duplicateIndex}`] = value;
      } else {
        row[header] = value;
      }
    });

    if (isSummaryDataRow(row)) continue;
    rows.push(row);
  }

  if (!rows.length) {
    throw new ApiError(400, "Excel sheet has no data rows after the header rows");
  }

  return {
    rows,
    headers: headers.filter(Boolean),
    headerRowIndex: endRow,
    headerRowsUsed: endRow - startRow + 1,
  };
}

export function readExcelBuffer(buffer) {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new ApiError(400, "Excel file has no sheets");
    }
    return rowsFromSheet(workbook.Sheets[sheetName]).rows;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "Failed to parse Excel file", error.message);
  }
}

export function readExcelPreview(buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new ApiError(400, "Excel file has no sheets");
  }

  const { rows, headers, headerRowIndex, headerRowsUsed } = rowsFromSheet(
    workbook.Sheets[sheetName]
  );

  return { rows, headers, headerRowIndex, headerRowsUsed };
}

export function getAllColumnValues(row, aliases) {
  const aliasList = Array.isArray(aliases) ? aliases : [aliases];
  const normalizedAliases = aliasList.map((alias) => normalizeHeader(alias));
  const matches = [];

  for (const [key, value] of Object.entries(row)) {
    const baseKey = normalizeHeader(stripHeaderSuffix(key));
    const matched = normalizedAliases.some(
      (alias) => baseKey === alias || baseKey.includes(alias) || alias.includes(baseKey)
    );
    if (matched) {
      matches.push({ key, value });
    }
  }

  matches.sort((a, b) => a.key.localeCompare(b.key));
  return matches.map((entry) => entry.value);
}

function findColumnMatch(normalizedEntries, aliasList) {
  const normalizedAliases = (Array.isArray(aliasList) ? aliasList : [aliasList]).map((alias) =>
    normalizeHeader(alias)
  );

  for (const alias of normalizedAliases) {
    const exact = normalizedEntries.find(([key]) => key === alias);
    if (exact) return exact;
  }

  for (const alias of normalizedAliases) {
    if (alias.length < 4) continue;
    const partial = normalizedEntries.find(([key]) => {
      if (key === alias) return true;
      if (key.startsWith(`${alias} `)) return true;
      if (key.endsWith(` ${alias}`)) return true;
      return key.includes(` ${alias} `);
    });
    if (partial) return partial;
  }

  return null;
}

export function mapRow(row, columnMap) {
  const mapped = {};
  const normalizedEntries = Object.entries(row).map(([key, value]) => [
    normalizeHeader(stripHeaderSuffix(key)),
    value,
    key,
  ]);

  for (const [field, aliases] of Object.entries(columnMap)) {
    const match = findColumnMatch(normalizedEntries, aliases);
    mapped[field] = match ? match[1] : "";
  }

  return mapped;
}

export function detectSheetType(headers) {
  const normalized = headers.map((header) => normalizeHeader(stripHeaderSuffix(header)));

  const hasInvoice =
    normalized.some((h) => h.includes("invoice no")) &&
    normalized.some((h) => h.startsWith("head 1"));
  if (hasInvoice) return "invoice";

  const hasStudentId = hasStudentIdHeaders(headers);
  const hasBilling = hasBillingHeaders(headers);
  if (hasStudentId && hasBilling) return "monthly_billing";

  const hasStudent =
    normalized.some((h) => h.includes("reg no") || h.includes("regno") || h.includes("roll no")) &&
    normalized.some((h) => h.includes("father") || h.includes("contact") || h === "name");
  if (hasStudent) return "student_master";

  const hasCms = normalized.some(
    (h) => h.includes("cms id") || h.includes("cmsid") || h.includes("cms no")
  );
  const hasNameAndCat =
    hasCms &&
    normalized.some((h) => h === "name" || h.includes("student name")) &&
    normalized.some((h) => h === "cat" || h.includes("category"));
  if (hasNameAndCat) return "student_master";

  if (hasCms && normalized.some((h) => h === "name")) return "student_master";

  return null;
}
