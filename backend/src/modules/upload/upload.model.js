import mongoose from "mongoose";

const UPLOAD_TYPES = ["student_master", "monthly_billing", "invoice", "auto"];

const uploadLogSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    sheetType: { type: String, enum: UPLOAD_TYPES, required: true },
    totalRows: { type: Number, default: 0 },
    created: { type: Number, default: 0 },
    updated: { type: Number, default: 0 },
    skipped: { type: Number, default: 0 },
    rejected: { type: Number, default: 0 },
    rowErrors: [{ cmsId: String, regNo: String, message: String }],
    voucherMonth: { type: String },
    voucherYear: { type: String },
    status: { type: String, enum: ["success", "partial", "failed"], default: "success" },
  },
  { timestamps: true }
);

export const UploadLog = mongoose.model("UploadLog", uploadLogSchema);
export { UPLOAD_TYPES };
