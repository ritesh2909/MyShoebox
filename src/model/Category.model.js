import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    image: {
      type: String,
    },
    name: { type: String },
    description: { type: String },
    slug: {type: String},
    
  },
  { timestamps: true }
);

export const Category = model("Category", categorySchema);
