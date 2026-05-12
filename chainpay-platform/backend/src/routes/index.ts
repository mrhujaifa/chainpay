import { Router } from "express";
import { WalletRoutes } from "../modules/wallet/wallet.route";
import { AuthRoutes } from "../modules/authentication/auth.route";
import { TransferRoutes } from "../modules/transfer/transfer.route";

const router = Router();

// auth route
router.use("/auth", AuthRoutes);

// wallet route
router.use("/wallets", WalletRoutes);

router.use("/transfer", TransferRoutes);

export const IndexRoutes: Router = router;
