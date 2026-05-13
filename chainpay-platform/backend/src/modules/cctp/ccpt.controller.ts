import status from "http-status";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response.util";
import { CCTPServices } from "./cctp.service";

const crossChainTransfer = asyncHandler(async (req, res) => {
  const { toAddress, amount, sourceBlockchain, destinationBlockchain } =
    req.body;

  if (!toAddress || !amount || !sourceBlockchain || !destinationBlockchain) {
    throw new AppError("All fields are required", 400);
  }

  const result = await CCTPServices.crossChainTransfer(req.dbUser!.id, {
    toAddress,
    amount,
    sourceBlockchain,
    destinationBlockchain,
  });

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Cross-chain transfer initiated",
    data: result,
  });
});

export const CCTPControllers = {
  crossChainTransfer,
};
