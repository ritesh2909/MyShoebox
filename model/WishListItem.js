const mongoose = require("mongoose");
const { Schema } = mongoose;

const WishListStatus = {
  ADDED: 1,
  REMOVED: 2,
  MOVED_TO_CART: 3,
}

const wishListItemSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    productInfoId: {
      type: Schema.Types.ObjectId,
      ref: "ProductInfo"
    },
    status: {
      type: Number,
      enum: Object.values(WishListStatus),
    }
  },
  { timestamps: true }
);

const WishListItem = mongoose.model("WishListItem", wishListItemSchema);
module.exports = { WishListItem, WishListStatus };
