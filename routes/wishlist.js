const express = require("express");
const wishListController = require("../controller/wishlist");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post(
  "/addtowishlist/:productId",
  verifyToken,
  wishListController.addToWishList
);

router.post(
  "/removefromwishlist/:productId",
  verifyToken,
  wishListController.removeFromWishList
);

router.get("/getwishlist", verifyToken, wishListController.getWishListProducts);

router.delete(
  "/v2/remove/:id",
  verifyToken,
  wishListController.V2RemoveFromWishList
);

router.put("/movetocart/:id", verifyToken, wishListController.moveToCart);

exports.router = router;
