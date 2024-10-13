import { Router } from "express";
import { registerUser, loginUser, requestOtp, otpLogin } from "../controllers/auth.controller.js";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/signin", requestOtp);
router.post("/otp-login", otpLogin);

export default router;
