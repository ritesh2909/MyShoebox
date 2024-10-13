import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const CouponStatusEnum = {
  ACTIVE: 1,
  INACTIVE: 2,
};

const couponSchema = new Schema(
  {
    couponStatus: {
      type: Number,
      enum: Object.values[CouponStatusEnum],
      default: CouponStatusEnum.ACTIVE,
    },
    couponCode: { type: String },
    name: { type: String },
    expiry: { type: Date },
    discountPerc: { type: Number },
    tnc: { type: String },
  },
  { timestamps: true }
);

export const Coupon = model("Coupon", couponSchema);
