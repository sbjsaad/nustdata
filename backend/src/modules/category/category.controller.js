import { asyncHandler } from "../../utils/asyncHandler.js";
import * as categoryService from "./category.service.js";

export const getCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategories(req.query);
  res.json({ success: true, data: result });
});

export const getCategoryByCode = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryByCode(req.params.code);
  res.json({ success: true, data: category });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.code, req.body);
  res.json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.code);
  res.json({ success: true, message: "Category deleted successfully" });
});
