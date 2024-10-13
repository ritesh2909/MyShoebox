import mongoose, { Schema as _Schema, model } from "mongoose";
const { Schema } = mongoose;

const reviewSchema = _Schema(
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

export const Review = model("Review", reviewSchema);
