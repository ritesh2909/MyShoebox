import mongoose, { Schema as _Schema, model } from "mongoose";
const { Schema } = mongoose;

const WishListStatus = {
  ADDED: 1,
  REMOVED: 2,
  MOVED_TO_CART: 3,
}

const wishListItemSchema = _Schema(
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

const WishListItem = model("WishListItem", wishListItemSchema);
export  { WishListItem, WishListStatus };
