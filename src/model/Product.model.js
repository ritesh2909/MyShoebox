import { Schema, model } from "mongoose";

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

const ProductGenderEnumMatch = {
  "Men": "MEN",
  "Women": "WOMEN",
  "Kids": "KIDS",
  "Girls": "GIRLS",
}

const productSchema = new Schema(
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

const Product = model("Product", productSchema);

// Use named exports
export { Product, ProductAvailablityEnum, ProductGenderEnum, ProductGenderEnumMatch };
