import { Router } from "express";
import { WalletRoutes } from "../modules/wallet/wallet.route";
import { AuthRoutes } from "../modules/authentication/auth.route";
import { TransferRoutes } from "../modules/transfer/transfer.route";
import { CCTPRoutes } from "../modules/cctp/ccpt.route";

const router = Router();

// auth route
router.use("/auth", AuthRoutes);

// wallet route
router.use("/wallets", WalletRoutes);

// transfer route
router.use("/transfer", TransferRoutes);

// CCTP route
router.use("/cctp", CCTPRoutes);

export const IndexRoutes: Router = router;
