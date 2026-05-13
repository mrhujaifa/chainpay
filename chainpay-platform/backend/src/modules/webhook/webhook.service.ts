import crypto from "crypto";
import { prisma } from "../../../lib/prisma";
import { config } from "../../config/env.config";

// ── 1. Signature Verify ──────────────────────────────
export const verifyCircleSignature = (
  rawBody: string,
  signature: string,
  timestamp: string,
): boolean => {
  const payload = `${timestamp}.${rawBody}`;

  const expectedSignature = crypto
    .createHmac("sha256", config.circle.webhookSecret)
    .update(payload)
    .digest("hex");

  // ✅ Timing-safe compare — brute force prevent করে
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
};

// ── 2. Event Handle করো ─────────────────────────────
export const handleCircleEvent = async (event: any) => {
  const { type, data } = event;

  switch (type) {
    // ✅ Transaction status update
    case "transactions.outbound.confirmed":
    case "transactions.inbound.confirmed": {
      await handleTransactionConfirmed(data);
      break;
    }

    case "transactions.outbound.failed":
    case "transactions.inbound.failed": {
      await handleTransactionFailed(data);
      break;
    }

    default:
      console.log(`Unhandled webhook event: ${type}`);
  }
};

// ── 3. Transaction Confirmed ─────────────────────────
const handleTransactionConfirmed = async (data: any) => {
  const { id, txHash } = data;

  // Circle transfer id দিয়ে DB তে খোঁজো
  const transaction = await prisma.transaction.findUnique({
    where: { circleTransferId: id },
  });

  if (!transaction) return; // আমাদের transaction না

  await prisma.transaction.update({
    where: { circleTransferId: id },
    data: {
      status: "COMPLETE",
      txHash: txHash ?? null,
    },
  });

  console.log(`✅ Transaction confirmed: ${id}`);
};

// ── 4. Transaction Failed ────────────────────────────
const handleTransactionFailed = async (data: any) => {
  const { id } = data;

  const transaction = await prisma.transaction.findUnique({
    where: { circleTransferId: id },
  });

  if (!transaction) return;

  await prisma.transaction.update({
    where: { circleTransferId: id },
    data: { status: "FAILED" },
  });

  console.log(`❌ Transaction failed: ${id}`);
};
