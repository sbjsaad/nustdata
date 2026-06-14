import { UploadLog } from "./upload.model.js";
import { readExcelPreview } from "../../utils/excelParser.js";
import {
  buildUploadMeta,
  determineUploadStatus,
  generateBatchId,
  mergeUploadResults,
  parseExcelFile,
  previewRows,
  resolveSheetType,
} from "./upload.utils.js";
import { rowsHaveBillingColumns } from "../../utils/excelParser.js";
import { upsertStudentsFromRows } from "../student/student.service.js";
import { upsertBillingsFromRows } from "../billing/billing.service.js";
import { upsertInvoicesFromRows } from "../invoice/invoice.service.js";
import { ApiError } from "../../utils/apiError.js";
import { buildPaginationMeta, parsePagination } from "../../utils/pagination.js";

const processors = {
  student_master: processStudentMasterUpload,
  monthly_billing: processMonthlyBillingUpload,
  invoice: upsertInvoicesFromRows,
};

async function processStudentMasterUpload(rows, meta) {
  const studentResults = await upsertStudentsFromRows(rows);

  if (!rowsHaveBillingColumns(rows)) {
    return studentResults;
  }

  const billingResults = await upsertBillingsFromRows(rows, meta);
  return mergeUploadResults(studentResults, billingResults, {
    students: studentResults,
    billing: billingResults,
  });
}

async function processMonthlyBillingUpload(rows, meta) {
  const billingResults = await upsertBillingsFromRows(rows, meta);
  const studentResults = await upsertStudentsFromRows(rows);

  return mergeUploadResults(billingResults, studentResults, {
    billing: billingResults,
    students: studentResults,
  });
}

export async function processExcelUpload(file, body = {}) {
  if (!file?.buffer) throw new ApiError(400, "No file uploaded");

  const rows = parseExcelFile(file.buffer);
  const sheetType = resolveSheetType(body.sheetType, rows);
  const batchId = generateBatchId();
  const meta = buildUploadMeta(body, batchId);

  const processor = processors[sheetType];
  if (!processor) throw new ApiError(400, `Unsupported sheet type: ${sheetType}`);

  const results = await processor(rows, meta);
  const status = determineUploadStatus(results);
  const saved = results.created + results.updated;

  const log = await UploadLog.create({
    batchId,
    fileName: file.originalname,
    sheetType,
    totalRows: rows.length,
    created: results.created,
    updated: results.updated,
    skipped: results.skipped,
    rejected: results.rejected || 0,
    rowErrors: results.errors,
    voucherMonth: meta.voucherMonth,
    voucherYear: meta.voucherYear,
    status,
  });

  return { results, log, sheetType, saved, status };
}

export async function previewExcelUpload(file, sheetType = "auto") {
  if (!file?.buffer) throw new ApiError(400, "No file uploaded");

  const { rows, headers, headerRowIndex, headerRowsUsed } = readExcelPreview(file.buffer);
  const detectedType = resolveSheetType(sheetType, rows);

  return {
    sheetType: detectedType,
    totalRows: rows.length,
    headerRowIndex: headerRowIndex + 1,
    headerRowsUsed,
    preview: previewRows(rows),
    headers,
  };
}

export async function getUploadLogs(query = {}) {
  const { page, limit, skip } = parsePagination(query, 10);

  const [logs, total] = await Promise.all([
    UploadLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    UploadLog.countDocuments(),
  ]);

  return { logs, ...buildPaginationMeta(total, page, limit) };
}

export async function getUploadLogByBatchId(batchId) {
  const log = await UploadLog.findOne({ batchId });
  if (!log) throw new ApiError(404, `Upload log not found: ${batchId}`);
  return log;
}
