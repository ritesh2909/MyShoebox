const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionStatusEnum = {
  PENDING: 1,
  SUCCESS: 2,
  FAILED: 3,
};

const transactionSchema = mongoose.Schema(
  {
    status: {
      type: Number,
      enum: Object.values(TransactionStatusEnum),
      default: TransactionStatusEnum.PENDING,
    },
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
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order"
    },
    taxAmount: {
      type: Number,
    }

  },
  { timestamps: true }
);

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);
module.exports = { Transaction, TransactionStatusEnum };
