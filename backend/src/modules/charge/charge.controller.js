import { asyncHandler } from "../../utils/asyncHandler.js";
import * as chargeService from "./charge.service.js";

export const createChargeEntry = asyncHandler(async (req, res) => {
  const entry = await chargeService.createChargeEntry(req.body);
  res.status(201).json({ success: true, data: entry });
});

export const getChargeEntries = asyncHandler(async (req, res) => {
  const result = await chargeService.getChargeEntries(req.query);
  res.json({ success: true, data: result });
});

export const getChargeById = asyncHandler(async (req, res) => {
  const entry = await chargeService.getChargeById(req.params.id);
  res.json({ success: true, data: entry });
});

export const getChargesByCmsId = asyncHandler(async (req, res) => {
  const result = await chargeService.getChargeSummaryByCmsId(req.params.cmsId);
  res.json({ success: true, data: result });
});

export const updateChargeEntry = asyncHandler(async (req, res) => {
  const entry = await chargeService.updateChargeEntry(req.params.id, req.body);
  res.json({ success: true, data: entry });
});

export const deleteChargeEntry = asyncHandler(async (req, res) => {
  await chargeService.deleteChargeEntry(req.params.id);
  res.json({ success: true, message: "Charge entry deleted successfully" });
});
