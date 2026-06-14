import { Router } from "express";
import * as categoryController from "./category.controller.js";

const router = Router();

router.get("/", categoryController.getCategories);
router.get("/:code", categoryController.getCategoryByCode);
router.post("/", categoryController.createCategory);
router.put("/:code", categoryController.updateCategory);
router.delete("/:code", categoryController.deleteCategory);

export default router;
