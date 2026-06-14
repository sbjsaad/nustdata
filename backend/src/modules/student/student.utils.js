import { mapRow, getAllColumnValues, normalizeCmsId } from "../../utils/excelParser.js";
import { STUDENT_CATEGORIES, STUDENT_TYPES } from "./student.model.js";

export const STUDENT_COLUMN_MAP = {
  sNo: ["S/No.", "Ser", "S No", "Serial", "Sr", "Sr No", "Sr. No"],
  category: ["Cat", "Category"],
  de: ["DE"],
  discipline: ["Discp", "Discipline", "Degree", "Program"],
  regNo: ["Reg No", "RegNo", "Registration No", "Reg. No", "Reg #", "Roll No", "Roll Number", "Roll #"],
  cmsId: ["CMS ID", "CMSID", "Cms Id", "CMS No", "CMS NO", "CMS Number", "CMS#", "CMS"],
  name: ["Name", "Student Name", "Name of Student", "Full Name", "Student"],
  fatherName: ["Father's Name", "Father Name", "Father s Name", "Fathers Name", "Father", "Guardian Name"],
  fatherOccupation: ["Father OCC", "Father Occupation", "Father Occ"],
  contactNumber: ["Contact Number", "Contact No", "Mobile No", "Phone", "Mobile", "Cell No", "Contact"],
  email: ["Email ID", "Email Adress", "Email Address", "Email"],
  gender: ["Gender", "Sex"],
  location: ["Loc", "Location", "City"],
  studentType: ["Student Type", "Type", "Boarder/Day Scholar", "Boarder Day Scholar"],
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
  const cmsId = normalizeCmsId(mapped.cmsId || mapped.regNo);

  if (!cmsId) return null;

  const contactValues = getAllColumnValues(row, [
    "Contact No",
    "Contact Number",
    "Mobile No",
    "Phone",
  ]);
  const contactNumber = String(mapped.contactNumber || contactValues[0] || "").trim();
  const parentContact = String(contactValues[1] || "").trim();

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
    contactNumber: contactNumber || parentContact,
    parentContactNumber: parentContact,
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
