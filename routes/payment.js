const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();
const { createPayment, stripeWebhook } = require("../controller/payment");

router.post("/create-payment-intent", verifyToken, createPayment);
router.get("/update-payment-status", verifyToken, stripeWebhook);

exports.router = router;
