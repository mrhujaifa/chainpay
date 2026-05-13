import { Router } from "express";
import { WalletRoutes } from "../modules/wallet/wallet.route";
import { AuthRoutes } from "../modules/authentication/auth.route";
import { TransferRoutes } from "../modules/transfer/transfer.route";
import { CCTPRoutes } from "../modules/cctp/ccpt.route";
import { GasRoutes } from "../modules/gas/gas.routes";

const router = Router();

// auth route
router.use("/auth", AuthRoutes);

// wallet route
router.use("/wallets", WalletRoutes);

// transfer route
router.use("/transfer", TransferRoutes);

// CCTP route
router.use("/cctp", CCTPRoutes);

// Gas route
router.use("/gas", GasRoutes);

export const IndexRoutes: Router = router;
