import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();
const authController = new AuthController

router.post('/register', authController.post_signup);
router.post('/login', authController.login_user);

export const AuthRouter = router;