import { Router } from "express";
import * as chargeController from "./charge.controller.js";

const router = Router();

router.get("/student/:cmsId", chargeController.getChargesByCmsId);
router.get("/:id", chargeController.getChargeById);
router.get("/", chargeController.getChargeEntries);
router.post("/", chargeController.createChargeEntry);
router.put("/:id", chargeController.updateChargeEntry);
router.delete("/:id", chargeController.deleteChargeEntry);

export default router;
