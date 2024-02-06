const express = require("express");

const router = express.Router();
const { createPayment } = require("../controller/payment");

router.post("/create-payment-intent", createPayment);

exports.router = router;
