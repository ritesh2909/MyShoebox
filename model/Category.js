const mongoose = require("mongoose");
const { Schema } = mongoose;
const categorySchema = new mongoose.Schema(
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

exports.Category = mongoose.model("Category", categorySchema);
