import { UploadLog } from "./upload.model.js";
import {
  buildUploadMeta,
  determineUploadStatus,
  generateBatchId,
  parseExcelFile,
  previewRows,
  resolveSheetType,
} from "./upload.utils.js";
import { upsertStudentsFromRows } from "../student/student.service.js";
import { upsertBillingsFromRows } from "../billing/billing.service.js";
import { upsertInvoicesFromRows } from "../invoice/invoice.service.js";
import { ApiError } from "../../utils/apiError.js";
import { buildPaginationMeta, parsePagination } from "../../utils/pagination.js";

const processors = {
  student_master: upsertStudentsFromRows,
  monthly_billing: upsertBillingsFromRows,
  invoice: upsertInvoicesFromRows,
};

export async function processExcelUpload(file, body = {}) {
  if (!file?.buffer) throw new ApiError(400, "No file uploaded");

  const rows = parseExcelFile(file.buffer);
  const sheetType = resolveSheetType(body.sheetType, rows);
  const batchId = generateBatchId();
  const meta = buildUploadMeta(body, batchId);

  const processor = processors[sheetType];
  if (!processor) throw new ApiError(400, `Unsupported sheet type: ${sheetType}`);

  const results = await processor(rows, meta);

  const log = await UploadLog.create({
    batchId,
    fileName: file.originalname,
    sheetType,
    totalRows: results.total,
    created: results.created,
    updated: results.updated,
    skipped: results.skipped,
    rowErrors: results.errors,
    voucherMonth: meta.voucherMonth,
    voucherYear: meta.voucherYear,
    status: determineUploadStatus(results),
  });

  return { results, log, sheetType };
}

export async function previewExcelUpload(file, sheetType = "auto") {
  if (!file?.buffer) throw new ApiError(400, "No file uploaded");

  const rows = parseExcelFile(file.buffer);
  const detectedType = resolveSheetType(sheetType, rows);

  return {
    sheetType: detectedType,
    totalRows: rows.length,
    preview: previewRows(rows),
    headers: Object.keys(rows[0] || {}),
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
