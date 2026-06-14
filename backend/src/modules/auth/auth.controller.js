import { asyncHandler } from "../../utils/asyncHandler.js";
import * as authService from "./auth.service.js";

export const signup = asyncHandler(async (req, res) => {
  const result = await authService.signupUser(req.body);
  res.status(201).json({ success: true, data: result });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.json({ success: true, data: result });
});

export const verifyInvite = asyncHandler(async (req, res) => {
  await authService.verifyInviteKey(req.body.signupKey);
  res.json({ success: true, data: { valid: true } });
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.id);
  res.json({ success: true, data: user });
});
