import { Router } from "express";
import { addToCart, removeFromCart, moveToWishList, getCartItems, getCheckoutInfo } from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/add-to-cart/:productInfoId", verifyToken, addToCart);
router.post("/single-remove-from-cart/:productInfoId", verifyToken, removeFromCart)
router.get("/movetowishlist", verifyToken, moveToWishList);
router.get("/getCartItem", verifyToken, getCartItems);
router.get("/checkout-info", verifyToken, getCheckoutInfo);

export default router;
