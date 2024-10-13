import mongoose, { Schema, model } from "mongoose";

const brandSchema = new Schema(
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

export const Brand = model("Brand", brandSchema);
