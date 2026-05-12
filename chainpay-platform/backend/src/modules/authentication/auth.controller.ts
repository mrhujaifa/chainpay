import status from "http-status";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response.util";
import { AuthServices } from "./auth.service";

const signUpWithEmail = asyncHandler(async (req, res) => {
  const payload = req.body;

  const result = await AuthServices.signUpWithEmail(payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Account created successfully",
    data: result,
  });
});

const signInWithEmail = asyncHandler(async (req, res) => {
  const payload = req.body;

  const result = await AuthServices.signInWithEmail(payload);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const AuthControllers = {
  signUpWithEmail,
  signInWithEmail,
};
