const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    productIds: { type: [String] },
    orders: { type: [Schema.Types.Mixed] },
  },
  { timestamps: true }
);

exports.Cart = mongoose.model("Cart", cartSchema);
