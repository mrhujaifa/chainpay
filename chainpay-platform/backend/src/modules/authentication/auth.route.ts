import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validate } from "../../middleware/validate";

const router = Router();

router.post("/signup", AuthControllers.signUpWithEmail);
router.post("/signin", AuthControllers.signInWithEmail);

export const AuthRoutes: Router = router;
