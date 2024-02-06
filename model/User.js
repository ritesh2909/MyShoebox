const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const UserStatusEnum = {
  ACTIVE: 1,
  SUSPENDED: 2,
  DELETED: 3,
};

const userSchema = new Schema(
  {
    status: {
      type: Number,
      enum: Object.values(UserStatusEnum),
      default: UserStatusEnum.ACTIVE,
    },
    firstName: {
      type: String,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
    browsedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    role: {
      type: String,
      default: "user",
    },
    lastLogin: { type: Date },
    status: { type: Boolean, default: true },
    token: { type: String },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetOtp: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },
    isMobileVerified: {
      type: Boolean,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = { User, UserStatusEnum };
