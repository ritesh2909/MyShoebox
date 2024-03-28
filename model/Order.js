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
  PAYMENT_FAILED: 8
};

const orderSchema = new Schema(
  {
    orderStatus: {
      type: Number,
      enum: Object.values[OrderStatusEnum],
      default: OrderStatusEnum.ORDERED,
    },
    orderId: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    orderAmount: { type: Number },
    deliveryAddress: { type: String },
    deliveryTime: { type: String }, // format of HH:MM
    orderDate: { type: Date },
    deliveryDate: { type: Date },
    instructions: { type: String },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
  },
  { timestamps: true }
);

const Order = mongoose.model(
  "Order", orderSchema
);

module.exports = { Order, OrderStatusEnum };