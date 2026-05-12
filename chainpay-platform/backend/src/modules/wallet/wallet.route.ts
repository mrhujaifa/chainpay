import { Router } from "express";
import { verifyAuth } from "../../middleware/verifyToken";
import { Role } from "../../../prisma/generated/enums";
import { WalletControllers } from "./wallet.controller";

const router = Router();
router.post(
  "/",
  verifyAuth(Role.USER, Role.ADMIN, Role.MODERATOR),
  WalletControllers.createWallet,
);
router.get(
  "/",
  verifyAuth(Role.USER, Role.ADMIN, Role.MODERATOR),
  WalletControllers.getMyWallets,
);
router.get(
  "/balance",
  verifyAuth(Role.USER, Role.ADMIN, Role.MODERATOR),
  WalletControllers.getMyBalance,
);
export const WalletRoutes: Router = router;
