import { Router } from "express";
import { verifyAuth } from "../../middleware/verifyToken";
import { Role } from "../../../prisma/generated/enums";
import { sendTransfer } from "./transfer.controller";

const router = Router();

router.post("/send", verifyAuth(Role.USER, Role.ADMIN), sendTransfer);

export const TransferRoutes: Router = router;
