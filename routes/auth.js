const express = require("express");
const authController = require("../controller/auth");
const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/signin", authController.requestOtp);
router.post("/otp-login", authController.otpLogin);
exports.router = router;
