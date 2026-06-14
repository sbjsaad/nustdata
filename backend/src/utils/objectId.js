import mongoose from "mongoose";
import { ApiError } from "./apiError.js";

export function parseObjectId(id, label = "ID") {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${label}`);
  }
  return id;
}
