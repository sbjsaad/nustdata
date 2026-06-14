import { Router } from "express";
import { uploadExcel as uploadMiddleware } from "../../middleware/upload.js";
import * as uploadController from "./upload.controller.js";

const router = Router();

router.post("/excel", uploadMiddleware.single("file"), uploadController.uploadExcel);
router.post("/preview", uploadMiddleware.single("file"), uploadController.previewExcel);
router.get("/logs", uploadController.getUploadLogs);
router.get("/logs/:batchId", uploadController.getUploadLogByBatchId);

export default router;
