import { STUDENT_CATEGORIES } from "../student/student.model.js";

export const DEFAULT_CATEGORIES = [
  {
    code: "NS",
    name: "Nursing School",
    description: "Nursing School students",
    chargeHeads: ["Messing Charges", "Laundry Charges", "Dhobi U/Wash", "Security H/M"],
  },
  {
    code: "GC",
    name: "General Category",
    description: "General category students",
    chargeHeads: ["Messing Charges", "Washing Charges", "Sports Charges"],
  },
  {
    code: "PC",
    name: "Professional College",
    description: "Professional college students",
    chargeHeads: ["Degree Charges", "UMS Charges", "Processing Fees"],
  },
  {
    code: "AES",
    name: "AES",
    description: "AES category students",
    chargeHeads: ["Six Month Fix Charges", "W&R Contribution", "Sports Charges"],
  },
];

export function validateCategoryPayload(data) {
  const errors = [];
  if (!data.code) errors.push("Category code is required");
  if (data.code && !STUDENT_CATEGORIES.includes(String(data.code).toUpperCase())) {
    errors.push(`Code must be one of: ${STUDENT_CATEGORIES.join(", ")}`);
  }
  if (!data.name) errors.push("Category name is required");
  return errors;
}
