const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = mongoose.Schema(
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

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);
module.exports = { Transaction };
