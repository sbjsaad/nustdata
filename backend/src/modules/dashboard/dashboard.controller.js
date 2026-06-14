import { asyncHandler } from "../../utils/asyncHandler.js";
import * as dashboardService from "./dashboard.service.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats();
  res.json({ success: true, data: stats });
});

export const getStudentFullProfile = asyncHandler(async (req, res) => {
  const profile = await dashboardService.getStudentFullProfile(req.params.cmsId);
  res.json({ success: true, data: profile });
});
