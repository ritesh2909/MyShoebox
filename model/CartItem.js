const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartItemSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    productId: { type: String },
    quantity: { type: Number },
    size: { type: Number },
    color: { type: String },
  },
  { timestamps: true }
);

exports.CartItem = mongoose.model("CartItem", cartItemSchema);
