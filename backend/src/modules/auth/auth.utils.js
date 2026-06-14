import crypto from "crypto";
import jwt from "jsonwebtoken";
import env from "../../config/env.js";
import { ApiError } from "../../utils/apiError.js";

export function validateSignupPayload(data) {
  const errors = [];
  if (!data.name?.trim()) errors.push("Name is required");
  if (!data.email?.trim()) errors.push("Email is required");
  if (!data.password || data.password.length < 6) errors.push("Password must be at least 6 characters");
  if (!data.signupKey) errors.push("Private signup key is required");
  return errors;
}

export function validateLoginPayload(data) {
  const errors = [];
  if (!data.email?.trim()) errors.push("Email is required");
  if (!data.password) errors.push("Password is required");
  return errors;
}

export function verifySignupKey(key) {
  if (!env.signupSecret) {
    throw new ApiError(403, "Signup is disabled. Set SIGNUP_SECRET in server environment.");
  }

  const provided = String(key || "");
  const expected = env.signupSecret;

  if (provided.length !== expected.length) {
    throw new ApiError(403, "Invalid private signup key");
  }

  const valid = crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  if (!valid) throw new ApiError(403, "Invalid private signup key");

  return true;
}

export function signToken(user) {
  return jwt.sign(
    { id: String(user._id), email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export function sanitizeUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
