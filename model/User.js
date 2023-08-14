const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    mobile: { type: String },
    password: { type: String, required: true },
    addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
    wishList: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    orders: { type: [Schema.Types.Mixed] },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

exports.User = mongoose.model("User", userSchema);
