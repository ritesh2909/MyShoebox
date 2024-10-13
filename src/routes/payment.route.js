import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createPayment, stripeWebhook } from "../controllers/payment.controller.js";

const router = Router();

router.post("/create-payment-intent", verifyToken, createPayment);
router.get("/update-payment-status", verifyToken, stripeWebhook);

export default router;
