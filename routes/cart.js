const express = require("express");
const cartController = require("../controller/cart");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-to-cart/", verifyToken, cartController.addToCart);
router.get("/getCartItem/", verifyToken, cartController.getCartItems);
router.get("/movetowishlist", verifyToken, cartController.moveToWishList);
router.get("/checkout-info", verifyToken, cartController.getCheckoutInfo);
exports.router = router;
