import { z } from "zod";

export const estimateFeeSchema = z.object({
  toAddress: z.string().min(10, "Invalid address"),
  amount: z.string().regex(/^\d+(\.\d{1,6})?$/, "Invalid amount"),
  tokenAddress: z.string().min(10, "Invalid token address"),
  blockchain: z.string().default("MATIC-AMOY"),
});

export const customGasSchema = z.object({
  toAddress: z.string().min(10, "Invalid address"),
  amount: z.string().regex(/^\d+(\.\d{1,6})?$/, "Invalid amount"),
  tokenAddress: z.string().min(10, "Invalid token address"),
  blockchain: z.string().default("MATIC-AMOY"),
  gasLimit: z.string().min(1, "Gas limit required"), // "21000"
  priorityFee: z.string().optional(), // "0.000000002"
  maxFee: z.string().optional(), // "0.000000004"
});

export type EstimateFeeInput = z.infer<typeof estimateFeeSchema>;
export type CustomGasInput = z.infer<typeof customGasSchema>;
