import { asyncHandler } from "../../utils/asyncHandler.js";
import * as invoiceService from "./invoice.service.js";

export const createInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.body);
  res.status(201).json({ success: true, data: invoice });
});

export const getInvoices = asyncHandler(async (req, res) => {
  const result = await invoiceService.getInvoices(req.query);
  res.json({ success: true, data: result });
});

export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id);
  res.json({ success: true, data: invoice });
});

export const getInvoicesByCmsId = asyncHandler(async (req, res) => {
  const result = await invoiceService.getInvoicesByCmsId(req.params.cmsId, req.query);
  res.json({ success: true, data: result });
});

export const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
  res.json({ success: true, data: invoice });
});

export const deleteInvoice = asyncHandler(async (req, res) => {
  await invoiceService.deleteInvoice(req.params.id);
  res.json({ success: true, message: "Invoice deleted successfully" });
});
