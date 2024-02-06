const mongoose = require("mongoose");
const { Schema } = mongoose;

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String },
    category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    contact: { type: String },
    website: { type: String },
    logo: { type: String },
    title: { type: String },
    thumbLine: { type: String },
  },
  { timestamps: true }
);

exports.Brand = mongoose.model("Brand", brandSchema);
