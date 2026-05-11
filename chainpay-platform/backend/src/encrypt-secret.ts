import fs from "fs";

import dotenv from "dotenv";

dotenv.config();

import { registerEntitySecretCiphertext } from "@circle-fin/developer-controlled-wallets";

const run = async () => {
  const response = await registerEntitySecretCiphertext({
    apiKey: process.env.CIRCLE_API_KEY!,

    entitySecret: process.env.ENTITY_SECRET!,
  });

  fs.writeFileSync(
    "recovery_file.dat",

    response.data?.recoveryFile ?? "",
  );

  console.log("✅ Entity Secret Registered");
};

run();
