import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validateSchema } from "../middlewares/validate";
import { registerSchema } from "../schemas/registerSchema";
import { loginSchema } from "../schemas/loginSchema";

const router = Router();
const authController = new AuthController

router.post('/register', validateSchema(registerSchema), authController.post_signup);
router.post('/login', validateSchema(loginSchema), authController.login_user);

export const AuthRouter = router;