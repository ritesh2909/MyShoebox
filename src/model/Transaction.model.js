import mongoose, { Schema as _Schema, model } from "mongoose";
const { Schema } = mongoose;

const transactionSchema = _Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    taxAmount: {
      type: Number,
    },
    isCompleted: {
      type: Boolean,
    }
  },
  { timestamps: true }
);

const Transaction = model(
  "Transaction",
  transactionSchema
);
export { Transaction };
