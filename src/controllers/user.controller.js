import { User, UserStatusEnum } from "../model/User.model.js";
import { sendEmail } from "../config/sendMail.js";
import { sendOTP } from "../config/sendOtp.js";
import { validateMongoDbId } from "../utils/validateMongoId.js";

export async function updateUser(req, res) {
  const id = req.body.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json("User not found!");
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName: req?.body?.firstName,
        middleName: req?.body?.middleName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    return res.status(204).json(updatedUser);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function addAddress(req, res) {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found!");
    }

    const updatedAddress = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      { new: true }
    );
    return res.status(204).json(updatedAddress);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function getAllUsers(req, res) {
  try {
    const allUsers = await User.find({}).populate("wishlist");
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function getAUser(req, res) {
  try {
    const id = req.params.id;
    // validateMongoDbId(id);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json("User not found!");
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export async function deleteUser(req, res) {
  try {
    const id = req.params;
    validateMongoDbId(id);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json("User not found!");
    }

    await User.findByIdAndUpdate(
      id,
      {
        status: UserStatusEnum.DELETED,
      },
      {
        new: true,
      }
    );
    return res.status(204).json("User Deleted");
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function suspendUser(req, res) {
  const id = req.params;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found!");
    }
    await User.findByIdAndUpdate(
      id,
      {
        status: UserStatusEnum.SUSPENDED,
      },
      {
        new: true,
      }
    );
    return res.status(204).json("User Suspended");
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function activateUser(req, res) {
  const id = req.params;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found!");
    }
    await User.findByIdAndUpdate(
      id,
      {
        status: UserStatusEnum.ACTIVE,
      },
      {
        new: true,
      }
    );
    return res.status(204).json("User activated");
  } catch (error) {}
}

export async function updatePassword(req, res) {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found!");
    }
    if (req.body.password) {
      user.password = password;
      user.save();
      return res.status(204).json(user);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function forgotPasswordOtp(req, res) {
  const email = req.body.email;
  const currentUser = await User.findOne({ email });
  if (!currentUser) {
    throw new Error("User not found!");
  }
  try {
    const generateOtp = await currentUser.createPasswordResetOtp();
    const resetURL = `<p>Hi, Password Reset OTP for the account is. This OTP is valid till 10 minutes from now.</p>`;
    const data = {
      to: email,
      text: "Password Reset Request for ShoezBazaar",
      subject: "Please follow the given link to update the password request",
      html: resetURL,
    };
    try {
      sendEmail(data);
    } catch (error) {
      console.log(error);
    }
    sendOTP(currentUser.mobile);
    console.log("email sent");
    return res.status(204).json("OTP sent on the registered mailId");
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function resetPassword(req, res) {
  const { password, otp } = req.body;

  try {
    const user = await User.findOne({
      passwordResetOtp: otp,
      passwordResetExpires: { gt: new Date() },
    });
    if (!user) {
      throw new Error("Token Expired, Please try again!");
    }
    user.password = password;
    user.passwordChangedAt = new Date();
    user.passwordResetOtp = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(204).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function getWishlist(req, res) {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
}
