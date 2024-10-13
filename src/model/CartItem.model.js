import mongoose, { Schema as _Schema, model } from "mongoose";
const { Schema } = mongoose;


const CartItemStatus = {
  ADDED: 1,
  REMOVED: 2,
  MOVED_TO_WISHLIST: 3,
  ORDERED: 4,
  PAYMENT_FAILED: 5,
}

const cartItemSchema = new _Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    productInfoId: {
      type: Schema.Types.ObjectId,
      ref: "ProductInfo"
    },
    status: {
      type: Number,
      enum: Object.values(CartItemStatus),
    },
    quantity: { type: Number },
  },
  { timestamps: true }
);

const CartItem = model("CartItem", cartItemSchema);
export { CartItem, CartItemStatus };
