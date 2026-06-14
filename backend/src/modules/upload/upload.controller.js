import { asyncHandler } from "../../utils/asyncHandler.js";
import * as uploadService from "./upload.service.js";

export const uploadExcel = asyncHandler(async (req, res) => {
  const result = await uploadService.processExcelUpload(req.file, req.body);
  res.status(201).json({
    success: true,
    message: "Excel uploaded and processed successfully",
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
