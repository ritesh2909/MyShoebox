const mongoose = require("mongoose");
const { ProductAvailablityEnum } = require("./Product");

const productInfoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    tags: { type: [String] },
    productId: {
      type: String,
    },
    color: {
      type: String,
    },
    size: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    thumbnail: { type: String },
    images: { type: [String] },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    availabilityStatus: {
      type: Number,
      enum: Object.values(ProductAvailablityEnum),
      default: ProductAvailablityEnum.IN_STOCK,
    },
    isDefault: {
      type: Boolean,
    },
    soldCount: { type: Number },
    rating: { type: Number },
  },
  { timestamps: true }
);

const ProductInfo = mongoose.model("ProductInfo", productInfoSchema);
module.exports = { ProductInfo };
