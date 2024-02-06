const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Products",
    },
    comment: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

exports.Review = mongoose.model("Review", reviewSchema);
