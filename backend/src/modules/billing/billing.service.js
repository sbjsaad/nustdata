import { Billing } from "./billing.model.js";
import { parseBillingRow, validateBillingPayload } from "./billing.utils.js";
import { ApiError } from "../../utils/apiError.js";
import { buildPaginationMeta, parsePagination } from "../../utils/pagination.js";
import { parseObjectId } from "../../utils/objectId.js";

export async function createBilling(data) {
  const errors = validateBillingPayload(data);
  if (errors.length) throw new ApiError(400, "Validation failed", errors);
  return Billing.create(data);
}

export async function upsertBillingsFromRows(rows, meta = {}) {
  const results = { created: 0, updated: 0, skipped: 0, rejected: 0, errors: [] };

  for (const row of rows) {
    const item = parseBillingRow(row, meta);
    if (!item) {
      results.rejected += 1;
      if (results.errors.length < 15) {
        results.errors.push({
          message: "Row skipped — missing CMS ID or headers did not match",
        });
      }
      continue;
    }

    try {
      const filter = {
        cmsId: item.cmsId,
        voucherMonth: item.voucherMonth || meta.voucherMonth || "",
        voucherYear: item.voucherYear || meta.voucherYear || "",
      };

      const existing = await Billing.findOne(filter);
      if (existing) {
        await Billing.updateOne({ _id: existing._id }, { $set: { ...item, uploadBatchId: meta.batchId } });
        results.updated += 1;
      } else {
        await Billing.create({ ...item, uploadBatchId: meta.batchId });
        results.created += 1;
      }
    } catch (error) {
      results.skipped += 1;
      results.errors.push({ cmsId: item.cmsId, message: error.message });
    }
  }

  return { ...results, total: rows.length };
}

export async function getBillings(query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.cmsId) filter.cmsId = String(query.cmsId).trim();
  if (query.category) filter.category = String(query.category).toUpperCase();
  if (query.voucherMonth) filter.voucherMonth = query.voucherMonth;
  if (query.voucherYear) filter.voucherYear = query.voucherYear;

  const [billings, total] = await Promise.all([
    Billing.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Billing.countDocuments(filter),
  ]);

  return { billings, ...buildPaginationMeta(total, page, limit) };
}

export async function getBillingById(id) {
  parseObjectId(id, "billing ID");
  const billing = await Billing.findById(id);
  if (!billing) throw new ApiError(404, `Billing record not found`);
  return billing;
}

export async function getBillingsByCmsId(cmsId, query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = { cmsId: String(cmsId).trim() };

  const [billings, total] = await Promise.all([
    Billing.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Billing.countDocuments(filter),
  ]);

  return { billings, ...buildPaginationMeta(total, page, limit) };
}

export async function updateBilling(id, data) {
  const errors = validateBillingPayload(data);
  if (errors.length) throw new ApiError(400, "Validation failed", errors);

  parseObjectId(id, "billing ID");
  const billing = await Billing.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!billing) throw new ApiError(404, "Billing record not found");
  return billing;
}

export async function deleteBilling(id) {
  parseObjectId(id, "billing ID");
  const billing = await Billing.findByIdAndDelete(id);
  if (!billing) throw new ApiError(404, "Billing record not found");
  return billing;
}

export async function bulkDeleteBillings({ ids = [], deleteAll = false, confirmText = "" } = {}) {
  if (deleteAll) {
    if (confirmText !== "DELETE ALL") {
      throw new ApiError(
        400,
        'Type "DELETE ALL" to permanently delete every billing record'
      );
    }

    const result = await Billing.deleteMany({});
    return { deletedBillings: result.deletedCount };
  }

  const objectIds = [...new Set(ids.map((id) => String(id).trim()).filter(Boolean))];
  if (!objectIds.length) throw new ApiError(400, "No billing records selected for deletion");

  objectIds.forEach((id) => parseObjectId(id, "billing ID"));

  const result = await Billing.deleteMany({ _id: { $in: objectIds } });
  return { deletedBillings: result.deletedCount, ids: objectIds };
}

export async function getBillingStats() {
  const [total, totalBalance, totalPaid] = await Promise.all([
    Billing.countDocuments(),
    Billing.aggregate([{ $group: { _id: null, sum: { $sum: "$balance" } } }]),
    Billing.aggregate([{ $group: { _id: null, sum: { $sum: "$paid" } } }]),
  ]);

  return {
    totalRecords: total,
    totalBalance: totalBalance[0]?.sum || 0,
    totalPaid: totalPaid[0]?.sum || 0,
  };
}
