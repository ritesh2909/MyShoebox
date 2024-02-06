const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductAvailablityEnum = {
  IN_STOCK: 1,
  OUT_OF_STOCK: 2,
  COMING_SOON: 3,
};

const ProductGenderEnum = {
  MEN: 1,
  WOMEN: 2,
  KIDS: 3,
  GIRLS: 4,
};

const productSchema = new mongoose.Schema(
  {
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    category: { type: [String] },
    productId: { type: String },
    gender: {
      type: Number,
      enum: Object.values(ProductGenderEnum),
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  let productId = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  const stringLength = 6;
  for (let i = 0; i < stringLength; i++) {
    productId += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  this.productId = productId;
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = { Product, ProductAvailablityEnum, ProductGenderEnum };
