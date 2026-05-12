import { type Request, type Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response.util";
import status from "http-status";
import { WalletServices } from "./wallet.service";

//* Wallet Create
const createWallet = asyncHandler(async (req: Request, res: Response) => {
  const { blockchain } = req.body;
  const wallet = await WalletServices.createWalletForUser(
    req.dbUser!.id,
    blockchain,
  );
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Wallet created successfully",
    data: wallet,
  });
});

//* My Wallets
const getMyWallets = asyncHandler(async (req: Request, res: Response) => {
  const wallets = await WalletServices.getUserWallets(req.dbUser!.id);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Wallets fetched successfully",
    data: wallets,
  });
});

//* Balance Check
const getMyBalance = asyncHandler(async (req: Request, res: Response) => {
  const balance = await WalletServices.getWalletBalance(req.dbUser!.id);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Balance fetched successfully",
    data: balance,
  });
});

export const WalletControllers = {
  createWallet,
  getMyBalance,
  getMyWallets,
};
