import { mapRow, parseNumber } from "../../utils/excelParser.js";
import { STUDENT_CATEGORIES, STUDENT_TYPES } from "./student.model.js";

export const STUDENT_COLUMN_MAP = {
  sNo: ["S/No.", "Ser", "S No", "Serial"],
  category: ["Cat", "Category"],
  de: ["DE"],
  discipline: ["Discp", "Discipline"],
  regNo: ["Reg No", "RegNo", "Registration No"],
  cmsId: ["CMS ID", "CMSID", "Cms Id"],
  name: ["Name", "Student Name"],
  fatherName: ["Father's Name", "Father Name", "Father s Name"],
  fatherOccupation: ["Father OCC", "Father Occupation"],
  contactNumber: ["Contact Number", "Contact No", "Mobile No", "Phone"],
  email: ["Email ID", "Email Adress", "Email Address", "Email"],
  gender: ["Gender"],
  location: ["Loc", "Location"],
  studentType: ["Student Type", "Type"],
};

export function normalizeCategory(value) {
  const cat = String(value || "NS").trim().toUpperCase();
  return STUDENT_CATEGORIES.includes(cat) ? cat : "NS";
}

export function normalizeStudentType(value, category) {
  const raw = String(value || "").trim().toLowerCase();
  if (raw.includes("day")) return "day_scholar";
  if (raw.includes("board")) return "boarder";
  return category === "NS" ? "boarder" : "day_scholar";
}

export function parseStudentRow(row) {
  const mapped = mapRow(row, STUDENT_COLUMN_MAP);
  const category = normalizeCategory(mapped.category);
  const cmsId = String(mapped.cmsId || mapped.regNo || "").trim();

  if (!cmsId) return null;

  return {
    sNo: String(mapped.sNo || "").trim(),
    category,
    de: String(mapped.de || "").trim(),
    discipline: String(mapped.discipline || "").trim(),
    regNo: String(mapped.regNo || cmsId).trim(),
    cmsId,
    name: String(mapped.name || "Unknown").trim(),
    fatherName: String(mapped.fatherName || "").trim(),
    fatherOccupation: String(mapped.fatherOccupation || "").trim(),
    contactNumber: String(mapped.contactNumber || "").trim(),
    email: String(mapped.email || "").trim(),
    gender: String(mapped.gender || "").trim(),
    location: String(mapped.location || "").trim(),
    studentType: normalizeStudentType(mapped.studentType, category),
  };
}

export function validateStudentPayload(data) {
  const errors = [];
  if (!data.cmsId) errors.push("CMS ID is required");
  if (!data.name) errors.push("Name is required");
  if (data.category && !STUDENT_CATEGORIES.includes(data.category.toUpperCase())) {
    errors.push(`Category must be one of: ${STUDENT_CATEGORIES.join(", ")}`);
  }
  if (data.studentType && !STUDENT_TYPES.includes(data.studentType)) {
    errors.push(`Student type must be one of: ${STUDENT_TYPES.join(", ")}`);
  }
  return errors;
}

export function sanitizeStudentQuery(query) {
  const filter = {};
  if (query.category) filter.category = String(query.category).toUpperCase();
  if (query.studentType) filter.studentType = query.studentType;
  if (query.search) {
    const search = String(query.search).trim();
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { cmsId: { $regex: search, $options: "i" } },
      { regNo: { $regex: search, $options: "i" } },
      { fatherName: { $regex: search, $options: "i" } },
    ];
  }
  return filter;
}
