import { Router } from "express";
import { uploadCSV, regeneratePassword } from "../controllers/adminController";
import { authMiddleware, adminOnly } from "../middlewares/authMiddleware";

const router = Router();


router.post("/upload-csv", authMiddleware, adminOnly,  uploadCSV);


router.post("/regenerate-password/:userId", authMiddleware, adminOnly, regeneratePassword);

export default router;
