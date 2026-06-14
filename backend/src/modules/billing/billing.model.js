import mongoose from "mongoose";

const chargeSchema = new mongoose.Schema(
  {
    sixMonthFixCharges: { type: Number, default: 0 },
    securityHM: { type: Number, default: 0 },
    wrContribution: { type: Number, default: 0 },
    laundryCharges: { type: Number, default: 0 },
    umsCharges: { type: Number, default: 0 },
    sportsCharges: { type: Number, default: 0 },
    degreeCharges: { type: Number, default: 0 },
    dhobiUWash: { type: Number, default: 0 },
    messingCharges: { type: Number, default: 0 },
    processingFees: { type: Number, default: 0 },
    arrear: { type: Number, default: 0 },
  },
  { _id: false }
);

const billingSchema = new mongoose.Schema(
  {
    ser: { type: String, trim: true },
    category: { type: String, trim: true, uppercase: true },
    cmsId: { type: String, trim: true, required: true, index: true },
    regNo: { type: String, trim: true },
    name: { type: String, trim: true },
    fatherName: { type: String, trim: true },
    fatherOccupation: { type: String, trim: true },
    contactNumber: { type: String, trim: true },
    email: { type: String, trim: true },
    gender: { type: String, trim: true },
    location: { type: String, trim: true },
    charges: { type: chargeSchema, default: () => ({}) },
    totalBill: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    lateFeeFine: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    dateOfBillsDeposited: { type: Date },
    voucherMonth: { type: String, trim: true },
    voucherYear: { type: String, trim: true },
    uploadBatchId: { type: String, trim: true },
  },
  { timestamps: true }
);

billingSchema.index({ cmsId: 1, voucherMonth: 1, voucherYear: 1 });

export const Billing = mongoose.model("Billing", billingSchema);
