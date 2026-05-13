import { Router } from "express";
import { CCTPControllers } from "./ccpt.controller";
import { verifyAuth } from "../../middleware/verifyToken";
import { Role } from "../../../prisma/generated/enums";

const router = Router();

router.post(
  "/",
  verifyAuth(Role.USER, Role.ADMIN, Role.MODERATOR),
  CCTPControllers.crossChainTransfer,
);

export const CCTPRoutes: Router = router;
