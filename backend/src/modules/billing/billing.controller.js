import { asyncHandler } from "../../utils/asyncHandler.js";
import * as billingService from "./billing.service.js";

export const createBilling = asyncHandler(async (req, res) => {
  const billing = await billingService.createBilling(req.body);
  res.status(201).json({ success: true, data: billing });
});

export const getBillings = asyncHandler(async (req, res) => {
  const result = await billingService.getBillings(req.query);
  res.json({ success: true, data: result });
});

export const getBillingById = asyncHandler(async (req, res) => {
  const billing = await billingService.getBillingById(req.params.id);
  res.json({ success: true, data: billing });
});

export const getBillingsByCmsId = asyncHandler(async (req, res) => {
  const result = await billingService.getBillingsByCmsId(req.params.cmsId, req.query);
  res.json({ success: true, data: result });
});

export const updateBilling = asyncHandler(async (req, res) => {
  const billing = await billingService.updateBilling(req.params.id, req.body);
  res.json({ success: true, data: billing });
});

export const deleteBilling = asyncHandler(async (req, res) => {
  await billingService.deleteBilling(req.params.id);
  res.json({ success: true, message: "Billing record deleted successfully" });
});

export const getBillingStats = asyncHandler(async (req, res) => {
  const stats = await billingService.getBillingStats();
  res.json({ success: true, data: stats });
});
