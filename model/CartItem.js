const mongoose = require("mongoose");
const { Schema } = mongoose;


const CartItemStatus = {
  ADDED: 1,
  REMOVED: 2,
  MOVED_TO_WISHLIST: 3,
}

const cartItemSchema = new mongoose.Schema(
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

const CartItem = mongoose.model("CartItem", cartItemSchema);
module.exports = {CartItem};
