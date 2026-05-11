import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../../middleware/verifyToken";
import * as AuthService from "./auth.service";
import { sendResponse } from "../../utils/response.util";

// ✅ Sign Up / Sign In — same endpoint
export const loginOrRegister = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await AuthService.findOrCreateUser(req.user!);
    const isNew = user.isNew;

    sendResponse(
      res,
      isNew ? 201 : 200,
      isNew ? "Account created successfully" : "Login successful",
      user.data,
    );
  },
);

// ✅ Get current user profile
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await AuthService.getUserById(req.user!.uid);
  sendResponse(res, 200, "Profile fetched successfully", user);
});

// ✅ Update profile
export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await AuthService.updateUserProfile(req.user!.uid, req.body);
    sendResponse(res, 200, "Profile updated successfully", user);
  },
);

// ✅ Logout — Backend এ token revoke করো
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  await AuthService.revokeToken(req.user!.uid);
  sendResponse(res, 200, "Logged out successfully");
});

// ✅ Delete account
export const deleteAccount = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await AuthService.softDeleteUser(req.user!.uid);
    sendResponse(res, 200, "Account deleted successfully");
  },
);
