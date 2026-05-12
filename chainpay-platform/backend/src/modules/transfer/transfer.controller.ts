import type { Request, Response } from "express";
import { TransferServices } from "./transfer.service";
import status from "http-status";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response.util";

export const sendTransfer = asyncHandler(async (req, res) => {
  const payload = req.body;
  const transfer = await TransferServices.sendTransfer(req.dbUser!.id, payload);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Transfer initiated successfully",
    data: transfer,
  });
});
