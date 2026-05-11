import { Router } from "express";
import { WalletRoutes } from "../modules/wallet/wallet.route";
import { AuthRoutes } from "../modules/authentication/auth.route";

const router = Router();

// auth route
router.use("/auth", AuthRoutes);

// wallet route
router.use("/wallet", WalletRoutes);

export const IndexRoutes: Router = router;
