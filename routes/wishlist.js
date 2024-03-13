const express = require("express");
const wishListController = require("../controller/wishlist");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();


// add to wishlist
// remove from wishlist
// move to cart
// get list with pagination


router.patch("/v2/addtowishlist/:productInfoId", verifyToken, wishListController.V2AddToWishlist);

router.get("/getwishlist", verifyToken, wishListController.getWishListProducts);

router.patch("/v2/remove/:id", verifyToken, wishListController.V2RemoveFromWishList
);

router.patch("/movetocart/:id", verifyToken, wishListController.moveToCart);

exports.router = router;
