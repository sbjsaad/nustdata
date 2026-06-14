import { Router } from "express";
import * as invoiceController from "./invoice.controller.js";

const router = Router();

router.get("/student/:cmsId", invoiceController.getInvoicesByCmsId);
router.get("/:id", invoiceController.getInvoiceById);
router.get("/", invoiceController.getInvoices);
router.post("/", invoiceController.createInvoice);
router.put("/:id", invoiceController.updateInvoice);
router.delete("/:id", invoiceController.deleteInvoice);

export default router;
