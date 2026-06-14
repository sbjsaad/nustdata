import { asyncHandler } from "../../utils/asyncHandler.js";
import * as uploadService from "./upload.service.js";

export const uploadExcel = asyncHandler(async (req, res) => {
  const result = await uploadService.processExcelUpload(req.file, req.body);
  const saved = result.saved;

  res.status(saved > 0 ? 201 : 422).json({
    success: saved > 0,
    message:
      saved > 0
        ? `Imported ${saved} record(s) successfully`
        : "No records were imported. Check that column headers match the selected sheet type, then preview the file first.",
    data: result,
  });
});

export const previewExcel = asyncHandler(async (req, res) => {
  const preview = await uploadService.previewExcelUpload(req.file, req.body.sheetType);
  res.json({ success: true, data: preview });
});

export const getUploadLogs = asyncHandler(async (req, res) => {
  const result = await uploadService.getUploadLogs(req.query);
  res.json({ success: true, data: result });
});

export const getUploadLogByBatchId = asyncHandler(async (req, res) => {
  const log = await uploadService.getUploadLogByBatchId(req.params.batchId);
  res.json({ success: true, data: log });
});
