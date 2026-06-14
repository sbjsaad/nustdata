import mongoose from "mongoose";

const CHARGE_TYPES = [
  "messing",
  "washing",
  "laundry",
  "sports",
  "security",
  "processing",
  "other",
];

const chargeEntrySchema = new mongoose.Schema(
  {
    cmsId: { type: String, required: true, trim: true, index: true },
    studentName: { type: String, trim: true },
    category: { type: String, trim: true, uppercase: true },
    studentType: { type: String, enum: ["boarder", "day_scholar"] },
    chargeType: { type: String, enum: CHARGE_TYPES, required: true },
    amount: { type: Number, required: true, min: 0 },
    month: { type: String, trim: true },
    year: { type: String, trim: true },
    notes: { type: String, trim: true },
    submittedBy: { type: String, trim: true },
  },
  { timestamps: true }
);

export const ChargeEntry = mongoose.model("ChargeEntry", chargeEntrySchema);
export { CHARGE_TYPES };
