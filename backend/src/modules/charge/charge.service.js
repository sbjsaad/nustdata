import { ChargeEntry } from "./charge.model.js";
import { validateChargePayload } from "./charge.utils.js";
import { ApiError } from "../../utils/apiError.js";
import { getStudentByCmsId } from "../student/student.service.js";
import { buildPaginationMeta, parsePagination } from "../../utils/pagination.js";
import { parseObjectId } from "../../utils/objectId.js";

export async function createChargeEntry(data) {
  const errors = validateChargePayload(data);
  if (errors.length) throw new ApiError(400, "Validation failed", errors);

  let studentName = data.studentName;
  let category = data.category;
  let studentType = data.studentType;

  try {
    const student = await getStudentByCmsId(data.cmsId);
    studentName = studentName || student.name;
    category = category || student.category;
    studentType = studentType || student.studentType;
  } catch {
    // Allow charge entry even if student not in master yet
  }

  return ChargeEntry.create({
    ...data,
    studentName,
    category,
    studentType,
    amount: Number(data.amount),
  });
}

export async function getChargeEntries(query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.cmsId) filter.cmsId = String(query.cmsId).trim();
  if (query.chargeType) filter.chargeType = query.chargeType;
  if (query.month) filter.month = query.month;
  if (query.year) filter.year = query.year;

  const [entries, total] = await Promise.all([
    ChargeEntry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ChargeEntry.countDocuments(filter),
  ]);

  return { entries, ...buildPaginationMeta(total, page, limit) };
}

export async function getChargeById(id) {
  parseObjectId(id, "charge ID");
  const entry = await ChargeEntry.findById(id);
  if (!entry) throw new ApiError(404, "Charge entry not found");
  return entry;
}

export async function getChargesByCmsId(cmsId, query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = { cmsId: String(cmsId).trim() };

  const [entries, total] = await Promise.all([
    ChargeEntry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ChargeEntry.countDocuments(filter),
  ]);

  return { entries, ...buildPaginationMeta(total, page, limit) };
}

export async function updateChargeEntry(id, data) {
  const errors = validateChargePayload(data);
  if (errors.length) throw new ApiError(400, "Validation failed", errors);

  parseObjectId(id, "charge ID");
  const entry = await ChargeEntry.findByIdAndUpdate(
    id,
    { $set: { ...data, amount: Number(data.amount) } },
    { new: true, runValidators: true }
  );
  if (!entry) throw new ApiError(404, "Charge entry not found");
  return entry;
}

export async function deleteChargeEntry(id) {
  parseObjectId(id, "charge ID");
  const entry = await ChargeEntry.findByIdAndDelete(id);
  if (!entry) throw new ApiError(404, "Charge entry not found");
  return entry;
}

export async function getChargeSummaryByCmsId(cmsId) {
  const { entries } = await getChargesByCmsId(cmsId, { limit: 1000 });
  const summary = entries.reduce((acc, entry) => {
    acc[entry.chargeType] = (acc[entry.chargeType] || 0) + entry.amount;
    acc.total = (acc.total || 0) + entry.amount;
    return acc;
  }, { total: 0 });

  return { entries, summary };
}
