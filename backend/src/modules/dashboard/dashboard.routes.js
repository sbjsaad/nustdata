import { Router } from "express";
import * as dashboardController from "./dashboard.controller.js";

const router = Router();

router.get("/stats", dashboardController.getDashboardStats);
router.get("/student/:cmsId", dashboardController.getStudentFullProfile);

export default router;
