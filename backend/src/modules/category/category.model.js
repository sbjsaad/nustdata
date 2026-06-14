import mongoose from "mongoose";
import { STUDENT_CATEGORIES } from "../student/student.model.js";

const categorySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      enum: STUDENT_CATEGORIES,
      required: true,
      unique: true,
      uppercase: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    chargeHeads: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
