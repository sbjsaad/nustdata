import multer from "multer";
import path from "path";
import { ApiError } from "../utils/apiError.js";
import env from "../config/env.js";

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if ([".xlsx", ".xls", ".csv"].includes(ext)) {
    cb(null, true);
    return;
  }
  cb(new ApiError(400, "Only Excel files (.xlsx, .xls, .csv) are allowed"));
};

export const uploadExcel = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxFileSizeMb * 1024 * 1024 },
});
