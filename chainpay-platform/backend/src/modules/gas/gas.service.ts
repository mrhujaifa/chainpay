import status from "http-status";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { CustomGasInput, EstimateFeeInput } from "./gas.validation";
import { circleDeveloperClient } from "../../../lib/circle";
import { v4 as uuidv4 } from "uuid";
import { USDC_ADDRESSES } from "./gas.constants";

// Transaction gas management
const estimateGasFree = async (userId: string, payload: EstimateFeeInput) => {
  const { amount, blockchain, toAddress, tokenAddress } = payload;

  const wallet = await prisma.wallet.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!wallet) {
    throw new AppError(`No wallet found for ${blockchain}`, status.NOT_FOUND);
  }

  const response = await circleDeveloperClient.estimateTransferFee({
    walletId: wallet.circleWalletId,
    blockchain: blockchain as any,
    destinationAddress: toAddress,
    amount: [amount],
    tokenAddress,
  });

  if (!response.data) {
    throw new AppError(
      "Could not estimate gas fee",
      status.INTERNAL_SERVER_ERROR,
    );
  }

  // Manual Platform Fee 0.01 = 1%
  const platformFee = Number(amount) * 0.01;

  return {
    slow: {
      networkFee: response.data.low,
      platformFee,
    },

    medium: {
      networkFee: response.data.medium,
      platformFee,
    },

    fast: {
      networkFee: response.data.high,
      platformFee,
    },

    recommendation: "medium",
  };
};

// User can transfer without gas fee handle by platform
const sendWithGasStation = async (
  userId: string,
  payload: EstimateFeeInput,
) => {
  const { amount, blockchain, toAddress, tokenAddress } = payload;

  const wallet = await prisma.wallet.findFirst({
    where: { userId, blockchain },
  });

  if (!wallet) {
    throw new AppError(`No wallet found for ${blockchain}`, status.NOT_FOUND);
  }

  const response = await circleDeveloperClient.createTransaction({
    idempotencyKey: uuidv4(),
    walletId: wallet.circleWalletId,
    blockchain,
    destinationAddress: toAddress,
    amounts: [amount],
    tokenAddress,
  });

  const transaction = response.data?.id;
  if (!transaction) {
    throw new AppError(
      "Gas station transaction failed",
      status.INTERNAL_SERVER_ERROR,
    );
  }

  return prisma.transaction.create({
    data: {
      circleTransferId: transaction,
      amount,
      tokenSymbol: "USDC",
      blockchain,
      status: "PENDING",
      type: "SEND",
      fromAddress: wallet.address,
      toAddress,
      userId,
    },
  });
};

const sendWithUSDCGas = async (userId: string, payload: EstimateFeeInput) => {
  const { toAddress, amount, blockchain } = payload;

  const wallet = await prisma.wallet.findFirst({
    where: { userId, blockchain },
  });

  if (!wallet) {
    throw new AppError(`No wallet found for ${blockchain}`, 404);
  }

  const tokenAddress = USDC_ADDRESSES[blockchain];

  if (!tokenAddress) {
    throw new AppError("USDC not supported on this chain", 400);
  }

  const response = await circleDeveloperClient.createTransaction({
    idempotencyKey: uuidv4(),
    walletId: wallet.circleWalletId,
    blockchain,
    destinationAddress: toAddress,
    amounts: [amount],
    tokenAddress,
    fee: {
      type: "level",
      config: { feeLevel: "MEDIUM" },
    },
  });

  const transaction = response.data?.id;

  if (!transaction) {
    throw new AppError("USDC gas transaction failed", 500);
  }

  return prisma.transaction.create({
    data: {
      circleTransferId: transaction,
      amount,
      tokenSymbol: "USDC",
      blockchain,
      status: "PENDING",
      type: "SEND",
      fromAddress: wallet.address,
      toAddress,
      userId,
    },
  });
};

export const GasServices = {
  estimateGasFree,
  sendWithGasStation,
  sendWithUSDCGas,
};
