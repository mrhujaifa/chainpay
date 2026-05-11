// lib/circle.ts
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import debug from "debug";

const log = debug("app:circle");

if (!process.env.CIRCLE_API_KEY) {
  throw new Error("CIRCLE_API_KEY is missing");
}
if (!process.env.ENTITY_SECRET) {
  log("Warning: ENTITY_SECRET not set. Read-only operations only.");
}

export const circle = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.ENTITY_SECRET as string,
});

// helper for safe calls
export async function safeCircleCall<T>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (err) {
    log("Circle API error", err);
    throw err;
  }
}
