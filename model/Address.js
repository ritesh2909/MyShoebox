const mongoose = require("mongoose");
const { Schema } = mongoose;

const AddressTypeEnum = {
  HOME: 1,
  OFFICE: 2,
};

const addressSchema = new Schema(
  {
    pincode: {
      type: String,
    },
    state: {
      type: String,
    },
    fullAddress: {
      type: String,
    },
    locality: {
      type: String,
    },
    city: {
      type: String,
    },
    typeOfAddress: {
      type: Number,
      enum: Object.values(AddressTypeEnum),
      default: AddressTypeEnum.HOME,
    },
    isDefaultAddress: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
module.exports = { Address, AddressTypeEnum };
