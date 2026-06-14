import crypto from "crypto";
import { detectSheetType, readExcelBuffer } from "../../utils/excelParser.js";
import { UPLOAD_TYPES } from "./upload.model.js";
import { ApiError } from "../../utils/apiError.js";

export function generateBatchId() {
  return `batch_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
}

export function resolveSheetType(requestedType, rows) {
  if (requestedType && requestedType !== "auto" && UPLOAD_TYPES.includes(requestedType)) {
    return requestedType;
  }

  const headers = Object.keys(rows[0] || {});
  const detected = detectSheetType(headers);
  if (!detected) {
    throw new ApiError(
      400,
      "Could not detect Excel sheet type. Please select type manually.",
      { headers }
    );
  }
  return detected;
}

export function buildUploadMeta(body, batchId) {
  return {
    batchId,
    voucherMonth: body.voucherMonth || "",
    voucherYear: body.voucherYear || "",
  };
}

export function determineUploadStatus(results) {
  if (results.skipped > 0 && results.created + results.updated === 0) return "failed";
  if (results.skipped > 0) return "partial";
  return "success";
}

export function previewRows(rows, limit = 5) {
  return rows.slice(0, limit);
}

export function parseExcelFile(buffer) {
  return readExcelBuffer(buffer);
}
