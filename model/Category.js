const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

exports.Category = mongoose.model("Category", categorySchema);
