import crypto from "crypto";
import { detectSheetType, readExcelBuffer } from "../../utils/excelParser.js";
import { UPLOAD_TYPES } from "./upload.model.js";
import { ApiError } from "../../utils/apiError.js";

export function generateBatchId() {
  return `batch_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
}

export function resolveSheetType(requestedType, rows) {
  const headers = Object.keys(rows[0] || {});

  if (requestedType && requestedType !== "auto" && UPLOAD_TYPES.includes(requestedType)) {
    return requestedType;
  }

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

export function mergeUploadResults(primary, secondary, extra = {}) {
  return {
    created: primary.created + secondary.created,
    updated: primary.updated + secondary.updated,
    skipped: primary.skipped + secondary.skipped,
    rejected: Math.max(primary.rejected || 0, secondary.rejected || 0),
    errors: [...primary.errors, ...secondary.errors].slice(0, 20),
    total: primary.total ?? secondary.total,
    ...extra,
  };
}

export function buildUploadMeta(body, batchId) {
  return {
    batchId,
    voucherMonth: body.voucherMonth || "",
    voucherYear: body.voucherYear || "",
  };
}

export function determineUploadStatus(results) {
  const saved = results.created + results.updated;
  if (saved === 0) return "failed";
  if ((results.skipped || 0) > 0 || (results.rejected || 0) > 0) return "partial";
  return "success";
}

export function previewRows(rows, limit = 5) {
  return rows.slice(0, limit);
}

export function parseExcelFile(buffer) {
  return readExcelBuffer(buffer);
}
