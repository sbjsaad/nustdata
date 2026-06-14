import { Category } from "./category.model.js";
import { DEFAULT_CATEGORIES, validateCategoryPayload } from "./category.utils.js";
import { ApiError } from "../../utils/apiError.js";
import { buildPaginationMeta, parsePagination } from "../../utils/pagination.js";
import { parseObjectId } from "../../utils/objectId.js";

export async function seedCategories() {
  for (const cat of DEFAULT_CATEGORIES) {
    await Category.findOneAndUpdate(
      { code: cat.code },
      { $setOnInsert: cat },
      { upsert: true, new: true }
    );
  }
}

export async function getCategories(query = {}) {
  const { page, limit, skip } = parsePagination(query, 10);
  const filter = { isActive: true };

  const [categories, total] = await Promise.all([
    Category.find(filter).sort({ code: 1 }).skip(skip).limit(limit),
    Category.countDocuments(filter),
  ]);

  return { categories, ...buildPaginationMeta(total, page, limit) };
}

export async function getCategoryByCode(code) {
  const category = await Category.findOne({ code: String(code).toUpperCase() });
  if (!category) throw new ApiError(404, `Category not found: ${code}`);
  return category;
}

export async function getCategoryById(id) {
  parseObjectId(id, "category ID");
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "Category not found");
  return category;
}

export async function createCategory(data) {
  const errors = validateCategoryPayload(data);
  if (errors.length) throw new ApiError(400, "Validation failed", errors);

  return Category.create({
    ...data,
    code: data.code.toUpperCase(),
  });
}

export async function updateCategory(code, data) {
  const category = await Category.findOneAndUpdate(
    { code: String(code).toUpperCase() },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!category) throw new ApiError(404, `Category not found: ${code}`);
  return category;
}

export async function deleteCategory(code) {
  const category = await Category.findOneAndUpdate(
    { code: String(code).toUpperCase() },
    { $set: { isActive: false } },
    { new: true }
  );
  if (!category) throw new ApiError(404, `Category not found: ${code}`);
  return category;
}
