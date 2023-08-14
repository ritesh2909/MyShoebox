const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number },
    discountPrice: { type: Number },
    rating: { type: Number },
    stock: { type: Number },
    brand: { type: String },
    category: { type: String },
    thumbnail: { type: String },
    images: { type: [String] },
    deleted: { type: Boolean },
  },
  { timestamps: true }
);

exports.Product = mongoose.model("Product", productSchema);
