import { Invoice } from "./invoice.model.js";
import { parseInvoiceRow } from "./invoice.utils.js";
import { ApiError } from "../../utils/apiError.js";
import { buildPaginationMeta, parsePagination } from "../../utils/pagination.js";
import { parseObjectId } from "../../utils/objectId.js";

export async function createInvoice(data) {
  if (!data.regNo && !data.invoiceNo) {
    throw new ApiError(400, "Reg No or Invoice No is required");
  }
  return Invoice.create(data);
}

export async function upsertInvoicesFromRows(rows, meta = {}) {
  const parsed = rows.map((row) => parseInvoiceRow(row, meta)).filter(Boolean);
  const results = { created: 0, updated: 0, skipped: 0, errors: [] };

  for (const item of parsed) {
    try {
      const filter = item.invoiceNo
        ? { invoiceNo: item.invoiceNo }
        : { regNo: item.regNo, voucherMonth: item.voucherMonth, voucherYear: item.voucherYear };

      const existing = await Invoice.findOne(filter);
      if (existing) {
        await Invoice.updateOne({ _id: existing._id }, { $set: { ...item, uploadBatchId: meta.batchId } });
        results.updated += 1;
      } else {
        await Invoice.create({ ...item, uploadBatchId: meta.batchId });
        results.created += 1;
      }
    } catch (error) {
      results.skipped += 1;
      results.errors.push({ regNo: item.regNo, message: error.message });
    }
  }

  return { ...results, total: parsed.length };
}

export async function getInvoices(query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.cmsId) filter.$or = [{ cmsId: query.cmsId }, { regNo: query.cmsId }];
  if (query.voucherMonth) filter.voucherMonth = query.voucherMonth;
  if (query.voucherYear) filter.voucherYear = query.voucherYear;

  const [invoices, total] = await Promise.all([
    Invoice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Invoice.countDocuments(filter),
  ]);

  return { invoices, ...buildPaginationMeta(total, page, limit) };
}

export async function getInvoiceById(id) {
  parseObjectId(id, "invoice ID");
  const invoice = await Invoice.findById(id);
  if (!invoice) throw new ApiError(404, "Invoice not found");
  return invoice;
}

export async function getInvoicesByCmsId(cmsId, query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const id = String(cmsId).trim();
  const filter = { $or: [{ cmsId: id }, { regNo: id }] };

  const [invoices, total] = await Promise.all([
    Invoice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Invoice.countDocuments(filter),
  ]);

  return { invoices, ...buildPaginationMeta(total, page, limit) };
}

export async function updateInvoice(id, data) {
  if (!data.regNo && !data.invoiceNo) {
    throw new ApiError(400, "Reg No or Invoice No is required");
  }

  parseObjectId(id, "invoice ID");
  const invoice = await Invoice.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!invoice) throw new ApiError(404, "Invoice not found");
  return invoice;
}

export async function deleteInvoice(id) {
  parseObjectId(id, "invoice ID");
  const invoice = await Invoice.findByIdAndDelete(id);
  if (!invoice) throw new ApiError(404, "Invoice not found");
  return invoice;
}
