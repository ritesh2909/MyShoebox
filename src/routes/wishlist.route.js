import { Router } from "express";
import { V2AddToWishlist, getWishListProducts, V2RemoveFromWishList, moveToCart } from "../controllers/wishlist.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();


// add to wishlist
// remove from wishlist
// move to cart
// get list with pagination


router.patch("/v2/addtowishlist/:productInfoId", verifyToken, V2AddToWishlist);

router.get("/getwishlist", verifyToken, getWishListProducts);

router.patch("/v2/remove/:id", verifyToken, V2RemoveFromWishList
);

router.patch("/movetocart/:id", verifyToken, moveToCart);

export default router;
