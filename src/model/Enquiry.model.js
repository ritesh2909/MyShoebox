import mongoose, { Schema as _Schema, model } from "mongoose";
const { Schema } = mongoose;

const EnquiryStatusEnum = {
  SUBMITTED: 1,
  CONTACTED: 2,
  IN_PROGRESS: 3,
  RESOLVED: 4,
};

const enquirySchema = new _Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    comment: {
      type: String,
    },
    enquiryStatus: {
      type: Number,
      enum: Object.values(EnquiryStatusEnum),
      default: EnquiryStatusEnum.SUBMITTED,
    },
  },
  { timestamps: true }
);

export const Enquiry = model("Enquiry", enquirySchema);
