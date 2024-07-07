import { Router } from "express";
import { UserController } from "../controllers/userController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = Router();
const userController = new UserController()

router.get('/users/:id', protectRoute, userController.user_record )

export const UserRouter = router;