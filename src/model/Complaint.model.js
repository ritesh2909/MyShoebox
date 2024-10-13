import mongoose, { Schema as _Schema, model } from "mongoose";
const { Schema } = mongoose;

const ComplaintTypeEnum = {
  ORDER_RELATED: 1,
  PAYMENT_RELATED: 2,
  PRODUCT_RELATED: 3,
  DELIEVERY_RELATED: 4,
  REFUND_RELATED: 5,
  OTHER: 6,
};

const ComplaintStatus = {
  PENDING: 1,
  RAISED: 2,
  RESOLVED: 3,
  OTHER: 4,
};

const enquirySchema = new _Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    complaintType: {
      type: Number,
      enum: Object.values(ComplaintTypeEnum),
    },
    complaintStatus: {
      type: Number,
      enum: Object.values(ComplaintStatus),
    },
  },
  { timestamps: true }
);

export const Enquiry = model("Enquiry", enquirySchema);
