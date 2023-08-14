const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

exports.Brand = mongoose.model("Brand", brandSchema);
