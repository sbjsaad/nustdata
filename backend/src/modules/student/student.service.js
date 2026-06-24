import { Student } from "./student.model.js";
import { Billing } from "../billing/billing.model.js";
import { Invoice } from "../invoice/invoice.model.js";
import { ChargeEntry } from "../charge/charge.model.js";
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
  const results = { created: 0, updated: 0, skipped: 0, rejected: 0, errors: [] };

  for (const row of rows) {
    const item = parseStudentRow(row);
    if (!item) {
      results.rejected += 1;
      if (results.errors.length < 15) {
        results.errors.push({
          message: "Row skipped — missing CMS ID / Reg No or headers did not match",
        });
      }
      continue;
    }

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

  return { ...results, total: rows.length };
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
  const id = String(cmsId).trim();
  const student = await Student.findOneAndDelete({ cmsId: id });
  if (!student) throw new ApiError(404, `Student not found with CMS ID: ${cmsId}`);

  await Promise.all([
    Billing.deleteMany({ cmsId: id }),
    Invoice.deleteMany({ cmsId: id }),
    ChargeEntry.deleteMany({ cmsId: id }),
  ]);

  return student;
}

export async function bulkDeleteStudents({ cmsIds = [], deleteAll = false, confirmText = "" } = {}) {
  if (deleteAll) {
    if (confirmText !== "DELETE ALL") {
      throw new ApiError(400, 'Type "DELETE ALL" to permanently delete every student and related billing data');
    }

    const [students, billings, invoices, charges] = await Promise.all([
      Student.deleteMany({}),
      Billing.deleteMany({}),
      Invoice.deleteMany({}),
      ChargeEntry.deleteMany({}),
    ]);

    return {
      deletedStudents: students.deletedCount,
      deletedBillings: billings.deletedCount,
      deletedInvoices: invoices.deletedCount,
      deletedCharges: charges.deletedCount,
    };
  }

  const ids = [...new Set(cmsIds.map((id) => String(id).trim()).filter(Boolean))];
  if (!ids.length) throw new ApiError(400, "No students selected for deletion");

  const [students, billings, invoices, charges] = await Promise.all([
    Student.deleteMany({ cmsId: { $in: ids } }),
    Billing.deleteMany({ cmsId: { $in: ids } }),
    Invoice.deleteMany({ cmsId: { $in: ids } }),
    ChargeEntry.deleteMany({ cmsId: { $in: ids } }),
  ]);

  return {
    deletedStudents: students.deletedCount,
    deletedBillings: billings.deletedCount,
    deletedInvoices: invoices.deletedCount,
    deletedCharges: charges.deletedCount,
    cmsIds: ids,
  };
}

export async function getStudentStats(query = {}) {
  const filter = {};

  if (query.category) {
    filter.category = String(query.category).toUpperCase();
  }

  const [total, byCategory, byType] = await Promise.all([
    Student.countDocuments(filter),
    Student.aggregate([{ $match: filter }, { $group: { _id: "$category", count: { $sum: 1 } } }]),
    Student.aggregate([{ $match: filter }, { $group: { _id: "$studentType", count: { $sum: 1 } } }]),
  ]);

  return {
    total,
    byCategory: Object.fromEntries(byCategory.map((c) => [c._id, c.count])),
    byType: Object.fromEntries(byType.map((t) => [t._id, t.count])),
  };
}
