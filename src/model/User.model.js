import mongoose, { model } from "mongoose";
import { genSaltSync, hashSync } from "bcrypt";
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
  const salt = genSaltSync(10);
  this.password = hashSync(this.password, salt);
  next();
});

const User = model("User", userSchema);
export { User, UserStatusEnum };
