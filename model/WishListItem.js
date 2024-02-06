const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishListItemSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: String,
    },
    color: { type: String },
    size: { type: Number },
  },
  { timestamps: true }
);

const WishListItem = mongoose.model("WishListItem", wishListItemSchema);
module.exports = { WishListItem };
