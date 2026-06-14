import { ApiError } from "../utils/apiError.js";
import env from "../config/env.js";

export function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  const response = {
    success: false,
    message,
  };

  if (err.details) {
    response.details = err.details;
  }

  if (env.nodeEnv === "development" && statusCode === 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
