import mongoose from "mongoose";

const STUDENT_CATEGORIES = ["NS", "GC", "PC", "AES"];
const STUDENT_TYPES = ["boarder", "day_scholar"];

const studentSchema = new mongoose.Schema(
  {
    sNo: { type: String, trim: true },
    category: {
      type: String,
      enum: STUDENT_CATEGORIES,
      required: true,
      uppercase: true,
    },
    de: { type: String, trim: true },
    discipline: { type: String, trim: true },
    regNo: { type: String, trim: true, index: true },
    cmsId: { type: String, trim: true, required: true, unique: true, index: true },
    name: { type: String, trim: true, required: true },
    fatherName: { type: String, trim: true },
    fatherOccupation: { type: String, trim: true },
    contactNumber: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    gender: { type: String, trim: true },
    location: { type: String, trim: true },
    studentType: {
      type: String,
      enum: STUDENT_TYPES,
      default: "boarder",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
export { STUDENT_CATEGORIES, STUDENT_TYPES };
