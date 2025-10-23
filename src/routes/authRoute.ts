import { Router } from "express";
import { register, login, changePassword } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", changePassword);

export default router;