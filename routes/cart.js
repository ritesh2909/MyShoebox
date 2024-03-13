const express = require("express");
const cartController = require("../controller/cart");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-to-cart/:productInfoId", verifyToken, cartController.addToCart);
router.post("/single-remove-from-cart/:productInfoId", verifyToken, cartController.removeFromCart)
router.get("/movetowishlist", verifyToken, cartController.moveToWishList);
router.get("/getCartItem", verifyToken, cartController.getCartItems);
router.get("/checkout-info", verifyToken, cartController.getCheckoutInfo);
exports.router = router;
