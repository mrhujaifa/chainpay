import { circleDeveloperClient } from "../../../lib/circle";
import { AppError } from "../../utils/AppError";
import { v4 as uuidv4 } from "uuid";
import type { SendTransferInput } from "./transfer.validation";
import { prisma } from "../../../lib/prisma";

// ✅ Circle Sandbox Token Addresses
const TOKEN_ADDRESSES: Record<string, Record<string, string>> = {
  "MATIC-AMOY": {
    USDC: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
  },
  "ETH-SEPOLIA": {
    USDC: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
  },
  "AVAX-FUJI": {
    USDC: "0x5425890298aed601595a70ab815c96711a31bc65",
  },
  "SOL-DEVNET": {
    USDC: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  },
};

//* USDC/USDT Send
export const sendTransfer = async (
  userId: string,
  payload: SendTransferInput,
) => {
  const { toAddress, amount, tokenSymbol, blockchain } = payload;

  const tokenAddress = TOKEN_ADDRESSES[blockchain]?.[tokenSymbol];

  if (!tokenAddress) {
    throw new AppError(`${tokenSymbol} not supported on ${blockchain}`, 400);
  }

  const wallet = await prisma.wallet.findFirst({
    where: { userId, blockchain },
  });

  if (!wallet) {
    throw new AppError(`No wallet found for ${blockchain}`, 404);
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

  const transaction = response.data;

  if (!transaction) {
    throw new AppError("Transfer failed", 500);
  }

  const savedTx = await prisma.transaction.create({
    data: {
      circleTransferId: transaction.id,
      amount,
      tokenSymbol,
      blockchain,
      status: "PENDING",
      type: "SEND",
      fromAddress: wallet.address,
      toAddress,
      userId,
    },
  });

  return savedTx;
};

const getTransactionHistory = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.transaction.count({
      where: { userId },
    }),
  ]);

  return {
    transactions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTransactionById = async (
  userId: string,
  transactionId: string,
) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId,
    },
  });

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  const circleStatus = await circleDeveloperClient.getTransaction({
    id: transaction.circleTransferId!,
  });

  const latestStatus = circleStatus.data?.transaction?.state;

  if (latestStatus && latestStatus !== transaction.status) {
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: latestStatus as any },
    });
  }

  return {
    ...transaction,
    status: latestStatus ?? transaction.status,
  };
};

export const TransferServices = {
  sendTransfer,
  getTransactionById,
  getTransactionHistory,
};
