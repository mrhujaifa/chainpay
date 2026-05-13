import { circleDeveloperClient } from "../../../lib/circle";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { v4 as uuidv4 } from "uuid";
import { CCTP_ROUTES, USDC_ADDRESSES } from "./ccpt.constant";
import type { ICCPTPayload } from "./ccpt.type";

const crossChainTransfer = async (userId: string, payload: ICCPTPayload) => {
  const { toAddress, amount, sourceBlockchain, destinationBlockchain } =
    payload;

  // Route supported check
  const supportedDestinations = CCTP_ROUTES[sourceBlockchain];

  if (!supportedDestinations?.includes(destinationBlockchain)) {
    throw new AppError(
      `CCTP route ${sourceBlockchain} → ${destinationBlockchain} not supported`,
      400,
    );
  }

  // Source wallet check
  const wallet = await prisma.wallet.findFirst({
    where: { userId, blockchain: sourceBlockchain },
  });

  if (!wallet) {
    throw new AppError(`No wallet found for ${sourceBlockchain}`, 404);
  }

  const tokenAddress = USDC_ADDRESSES[sourceBlockchain];

  if (!tokenAddress) {
    throw new AppError("USDC not supported on this chain", 400);
  }

  // Circle CCTP transfer create
  const response = await circleDeveloperClient.createTransaction({
    idempotencyKey: uuidv4(),
    walletId: wallet.circleWalletId,
    blockchain: sourceBlockchain as any,
    destinationAddress: toAddress,
    amounts: [amount],
    tokenAddress,
    destinationBlockchain,
    fee: {
      type: "level",
      config: { feeLevel: "MEDIUM" },
    },
  });

  const transaction = response.data?.id;

  if (!transaction) {
    throw new AppError("Cross-chain transfer failed", 500);
  }

  // save in the DB txn
  const savedTx = await prisma.transaction.create({
    data: {
      circleTransferId: transaction,
      amount,
      tokenSymbol: "USDC",
      blockchain: sourceBlockchain,
      status: "PENDING",
      type: "SEND",
      fromAddress: wallet.address,
      toAddress,
      userId,
    },
  });

  return {
    transaction: savedTx,
    route: `${sourceBlockchain} → ${destinationBlockchain}`,
  };
};

export const CCTPServices = {
  crossChainTransfer,
};
