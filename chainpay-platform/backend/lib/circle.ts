// lib/circle.ts
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import { config } from "../src/config/env.config";

export const circleDeveloperClient = initiateDeveloperControlledWalletsClient({
  apiKey: config.circle.apiKey,
  entitySecret: config.circle.entitySecret,
});
