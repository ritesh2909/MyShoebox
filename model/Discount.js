const mongoose = require("mongoose")
const { Schema } = mongoose;


const DiscountStatusEnum = {
  APPLIED: 1,
  REMOVED: 2
}

const DiscountEntityEnum = {
  OFFER: 1,
  COUPON: 2,
  DISCOUNT: 3,
}

const discountSchema = new Schema(
  {
    discountStatus: {
      type: Number,
      enum: Object.values(DiscountStatusEnum),
      default: DiscountStatusEnum.APPLIED
    },
    userId: {
      type: Schema.Types.ObjectId, ref: "User",
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction"
    },
    amount: {
      type: Number
    },
    entityType: {
      type: Number,
      enum: Object.values(DiscountEntityEnum),
    },
    entity_id: {
      type: Schema.Types.ObjectId
    }
  },
  { timestamps: true }
)

const Discount = mongoose.model(
  "Discount",
  discountSchema
)

module.exports = { DiscountEntityEnum, DiscountStatusEnum, Discount };
