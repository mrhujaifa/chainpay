//     estimateGasFree,
//   sendWithGasStation,
//   sendWithUSDCGas,

import status from "http-status";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response.util";
import { GasServices } from "./gas.service";

const estimateGasFree = asyncHandler(async (req, res) => {
  const body = req.body;

  const result = await GasServices.estimateGasFree(req.dbUser!.id, body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Gas fee estimated successfully",
    data: result,
  });
});

const sendWithGasStation = asyncHandler(async (req, res) => {
  const body = req.body;

  const result = await GasServices.sendWithGasStation(req.dbUser!.id, body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Transaction sent with gas station",
    data: result,
  });
});

const sendWithUSDCGas = asyncHandler(async (req, res) => {
  const body = req.body;
  const result = await GasServices.sendWithUSDCGas(req.dbUser!.id, body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Transaction sent with USDC gas",
    data: result,
  });
});

export const GasControllers = {
  estimateGasFree,
  sendWithGasStation,
  sendWithUSDCGas,
};
