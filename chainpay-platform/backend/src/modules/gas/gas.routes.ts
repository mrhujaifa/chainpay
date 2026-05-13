import { Router } from "express";
import { verifyAuth } from "../../middleware/verifyToken";
import { Role } from "../../../prisma/generated/enums";
import { GasControllers } from "./gas.controller";

const router = Router();

router.post(
  "/estimate",
  verifyAuth(Role.USER, Role.ADMIN),
  GasControllers.estimateGasFree,
);
router.post(
  "/send-with-gas-station",
  verifyAuth(Role.USER, Role.ADMIN),
  GasControllers.sendWithGasStation,
);

router.post(
  "/send-with-usdc-gas",
  verifyAuth(Role.USER, Role.ADMIN),
  GasControllers.sendWithUSDCGas,
);

export const GasRoutes: Router = router;
