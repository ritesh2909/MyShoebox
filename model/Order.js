const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderStatusEnum = {
  ORDERED: 1,
  DELIVERED: 2,
  CANCELLED: 3,
  RETURNED: 4,
  RETURN_REQUESTED: 5,
  CANCELL_REQUESTED: 6,
  DISPATCHED: 7,
};

const orderSchema = new Schema(
  {
    orderStatus: {
      type: Number,
      enum: Object.values[OrderStatusEnum],
      default: OrderStatusEnum.ORDERED,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    orderAmount: { type: Number },
    isCouponApplied: { type: Boolean },
    deliveryAddress: { type: String },
    deliveryTime: { type: String }, // format of HH:MM
    orderDate: { type: Date },
    orderTime: { type: String }, // format of HH:MM
    deliveryDate: { type: Date },
    instructions: { type: String },
  },
  { timestamps: true }
);

exports.Order = mongoose.model("Order", orderSchema);
