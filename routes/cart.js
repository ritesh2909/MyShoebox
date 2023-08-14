const express = require("express");

const router = express.Router();

router.get("/:id", getCartByUserId);
router.get("/addtoCart", addToCart);

exports.router = router;
