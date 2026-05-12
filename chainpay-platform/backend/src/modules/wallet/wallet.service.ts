import { circleDeveloperClient } from "../../../lib/circle";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../utils/AppError";
import status from "http-status";

//* create developer wallet
const createWalletSet = async () => {
  const response = await circleDeveloperClient.createWalletSet({
    name: `chainpay-set-${uuidv4()}`,
    idempotencyKey: uuidv4(),
  });

  console.log(response);

  return response.data?.walletSet;
};

//* create wallet for user
const createWalletForUser = async (
  userId: string,
  blockchain: string = "MATIC-AMOY",
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallets: true,
    },
  });

  if (!user) {
    if (!user) {
      throw new AppError("User not found", status.NOT_FOUND);
    }
  }

  const existingWallet = user?.wallets.find((w) => w.blockchain === blockchain);

  if (existingWallet) {
    throw new AppError(
      `Wallet already exists for ${blockchain}`,
      status.BAD_REQUEST,
    );
  }

  const walletSet = await createWalletSet();

  if (!walletSet?.id) {
    throw new AppError(
      "Failed to create wallet set",
      status.INTERNAL_SERVER_ERROR,
    );
  }

  const response = await circleDeveloperClient.createWallets({
    idempotencyKey: uuidv4(),
    walletSetId: walletSet.id,
    blockchains: [blockchain] as any,
    count: 1,
  });

  const circleWallet = response.data?.wallets?.[0];

  console.log(circleWallet);

  if (!circleWallet) {
    throw new AppError("Failed to create wallet", 500);
  }

  const wallet = await prisma.wallet.create({
    data: {
      circleWalletId: circleWallet.id,
      address: circleWallet.address,
      blockchain: circleWallet.blockchain,
      walletSetId: walletSet.id,
      userId,
    },
  });

  return wallet;
};

//* Get wallet balance
const getWalletBalance = async (userId: string) => {
  const wallets = await prisma.wallet.findMany({
    where: { userId },
  });

  if (!wallets.length) {
    throw new AppError("No wallet found", 404);
  }

  const balances = await Promise.all(
    wallets.map(async (wallet) => {
      const response = await circleDeveloperClient.getWalletTokenBalance({
        id: wallet.circleWalletId,
      });

      return {
        walletId: wallet.id,
        address: wallet.address,
        blockchain: wallet.blockchain,
        tokenBalances: response.data?.tokenBalances ?? [],
      };
    }),
  );

  return balances;
};

//* Get user wallets
const getUserWallets = async (userId: string) => {
  return prisma.wallet.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const WalletServices = {
  createWalletSet,
  createWalletForUser,
  getWalletBalance,
  getUserWallets,
};
