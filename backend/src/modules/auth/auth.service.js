import bcrypt from "bcryptjs";
import { User } from "./auth.model.js";
import {
  sanitizeUser,
  signToken,
  validateLoginPayload,
  validateSignupPayload,
  verifySignupKey,
} from "./auth.utils.js";
import { ApiError } from "../../utils/apiError.js";

export async function signupUser(data) {
  const errors = validateSignupPayload(data);
  if (errors.length) throw new ApiError(400, "Validation failed", errors);

  verifySignupKey(data.signupKey);

  const existing = await User.findOne({ email: data.email.toLowerCase().trim() });
  if (existing) throw new ApiError(409, "Email already registered");

  const hashed = await bcrypt.hash(data.password, 12);
  const user = await User.create({
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    password: hashed,
    role: "staff",
  });

  const token = signToken(user);
  return { user: sanitizeUser(user), token };
}

export async function loginUser(data) {
  const errors = validateLoginPayload(data);
  if (errors.length) throw new ApiError(400, "Validation failed", errors);

  const user = await User.findOne({ email: data.email.toLowerCase().trim() }).select("+password");
  if (!user || !user.isActive) throw new ApiError(401, "Invalid email or password");

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) throw new ApiError(401, "Invalid email or password");

  const token = signToken(user);
  return { user: sanitizeUser(user), token };
}

export async function verifyInviteKey(signupKey) {
  verifySignupKey(signupKey);
  return { valid: true };
}

export async function getUserById(id) {
  const user = await User.findById(id);
  if (!user || !user.isActive) throw new ApiError(401, "User not found");
  return sanitizeUser(user);
}
