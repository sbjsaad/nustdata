import { Student } from "./student.model.js";
import { parseStudentRow, sanitizeStudentQuery, validateStudentPayload } from "./student.utils.js";
import { ApiError } from "../../utils/apiError.js";
import { buildPaginationMeta, parsePagination } from "../../utils/pagination.js";

export async function createStudent(data) {
  const errors = validateStudentPayload(data);
  if (errors.length) throw new ApiError(400, "Validation failed", errors);

  const student = await Student.create({
    ...data,
    category: data.category?.toUpperCase(),
  });
  return student;
}

export async function upsertStudentsFromRows(rows) {
  const parsed = rows.map(parseStudentRow).filter(Boolean);
  const results = { created: 0, updated: 0, skipped: 0, errors: [] };

  for (const item of parsed) {
    try {
      const existing = await Student.findOne({ cmsId: item.cmsId });
      if (existing) {
        await Student.updateOne({ cmsId: item.cmsId }, { $set: item });
        results.updated += 1;
      } else {
        await Student.create(item);
        results.created += 1;
      }
    } catch (error) {
      results.skipped += 1;
      results.errors.push({ cmsId: item.cmsId, message: error.message });
    }
  }

  return { ...results, total: parsed.length };
}

export async function getStudents(query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = sanitizeStudentQuery(query);

  const [students, total] = await Promise.all([
    Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Student.countDocuments(filter),
  ]);

  return { students, ...buildPaginationMeta(total, page, limit) };
}

export async function getStudentByCmsId(cmsId) {
  const student = await Student.findOne({ cmsId: String(cmsId).trim() });
  if (!student) throw new ApiError(404, `Student not found with CMS ID: ${cmsId}`);
  return student;
}

export async function updateStudent(cmsId, data) {
  const errors = validateStudentPayload({ ...data, cmsId });
  if (errors.length) throw new ApiError(400, "Validation failed", errors);

  const student = await Student.findOneAndUpdate(
    { cmsId: String(cmsId).trim() },
    { $set: { ...data, category: data.category?.toUpperCase() } },
    { new: true, runValidators: true }
  );

  if (!student) throw new ApiError(404, `Student not found with CMS ID: ${cmsId}`);
  return student;
}

export async function deleteStudent(cmsId) {
  const student = await Student.findOneAndDelete({ cmsId: String(cmsId).trim() });
  if (!student) throw new ApiError(404, `Student not found with CMS ID: ${cmsId}`);
  return student;
}

export async function getStudentStats() {
  const [total, byCategory, byType] = await Promise.all([
    Student.countDocuments(),
    Student.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
    Student.aggregate([{ $group: { _id: "$studentType", count: { $sum: 1 } } }]),
  ]);

  return {
    total,
    byCategory: Object.fromEntries(byCategory.map((c) => [c._id, c.count])),
    byType: Object.fromEntries(byType.map((t) => [t._id, t.count])),
  };
}
