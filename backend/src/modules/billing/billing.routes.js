import { Router } from "express";
import * as billingController from "./billing.controller.js";

const router = Router();

router.get("/stats", billingController.getBillingStats);
router.get("/student/:cmsId", billingController.getBillingsByCmsId);
router.get("/:id", billingController.getBillingById);
router.get("/", billingController.getBillings);
router.post("/", billingController.createBilling);
router.put("/:id", billingController.updateBilling);
router.delete("/:id", billingController.deleteBilling);

export default router;
