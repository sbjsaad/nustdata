import mongoose from "mongoose";

const headSchema = new mongoose.Schema(
  {
    head: { type: String, trim: true },
    amount: { type: Number, default: 0 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, trim: true, index: true },
    regNo: { type: String, trim: true, index: true },
    cmsId: { type: String, trim: true, index: true },
    heads: [headSchema],
    balance: { type: Number, default: 0 },
    dueDate: { type: Date },
    amountAfterDueDate: { type: Number, default: 0 },
    expiryDate: { type: Date },
    issueDate: { type: Date },
    voucherMonth: { type: String, trim: true },
    voucherYear: { type: String, trim: true },
    name: { type: String, trim: true },
    mobileNo: { type: String, trim: true },
    emailId: { type: String, trim: true },
    branch: { type: String, trim: true },
    uploadBatchId: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);
