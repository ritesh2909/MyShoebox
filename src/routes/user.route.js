import { Router } from "express";
import { updateUser, forgotPasswordOtp, getAUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();

router.put("/edit-user", verifyToken, updateUser);
router.post("/forgot-password", forgotPasswordOtp);
router.get("/:id", getAUser);

export default router;

