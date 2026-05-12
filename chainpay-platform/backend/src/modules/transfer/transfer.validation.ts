import { z } from "zod";

export const sendTransferSchema = z.object({
  toAddress: z.string().min(10, "Invalid wallet address"),
  amount: z.string().regex(/^\d+(\.\d{1,6})?$/, "Invalid amount"), // "10.50"
  tokenSymbol: z.enum(["USDC", "USDT"]).default("USDT"),
  blockchain: z.string().default("MATIC-AMOY"),
});

export type SendTransferInput = z.infer<typeof sendTransferSchema>;
