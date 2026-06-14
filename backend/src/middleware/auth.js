import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized — please login");
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    next();
  } catch {
    throw new ApiError(401, "Session expired — please login again");
  }
});
