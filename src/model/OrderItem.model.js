import mongoose, { model } from "mongoose";
const { Schema } = mongoose;


const orderItemSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    productInfo: {
      title: { type: String },
      description: { type: String },
      productId: { type: String },
      color: { type: String },
      size: { type: Number },
      quantity: { type: Number },
      thumbnail: { type: String },
      purchasedPrice: { type: Number },
    }
  },
  { timestamps: true }
);

const OrderItem = model("OrderItem", orderItemSchema)
export  { OrderItem };