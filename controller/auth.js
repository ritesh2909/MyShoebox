const { generateToken } = require("../config/jwtToken");
const { User } = require("../model/User");
const jwt = require("jsonwebtoken");
const { sendOTP } = require("../config/sendOtp");
const { newOtp } = require("../config/generateOtp");
const moment = require("moment");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(409).json("User Already exists!");
  }
  const newUser = new User(req.body);

  try {
    const savedUser = await User.create(newUser);
    return res.status(200).json(savedUser);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.loginUser = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json("User not found!");
  }
  try {
    // todo secure password
    if (!user.password) {
      return res.status(404).json("Password not found!");
    }
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(401).json("Wrong Credentials!!");
    }
    const token = await generateToken(user?._id);
    await User.findByIdAndUpdate(
      user?._id,
      {
        token: token,
        lastLogin: new Date(),
      },
      { $new: true }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    // updating login time and token
    return res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      token: token,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.handletoken = async (req, res) => {
  const cookie = req.cookie;
  if (!cookie?.token) {
    throw new Error("Refresh Token not found!");
  }
  const token = cookie.token;
  const currentUser = await User.findOne({ token });
  if (!currentUser) {
    return res.status(401).json("User not found, Try Login again!");
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err || currentUser.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = await generateToken(user._id);
    res.json({ accessToken });
  });
};

exports.logout = async (req, res) => {
  const cookie = req.cookie;
  const token = cookie.token;
  const currentUser = await User.findOne({ token });
  if (!currentUser) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  } else {
    await User.findOneAndUpdate(token, {
      token: "",
    });
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
};

exports.requestOtp = async (req, res) => {
  const mobile = req.body.mobile;
  if (!mobile) {
    return res.status(422).json("Mobile Number not found!");
  }
  if (mobile.length != 10) {
    return res.status(422).json("Invalid Mobile Number!");
  }
  const user = await User.findOne({ mobile });

  if (user) {
    // user already exists
    const otpGenerated = await newOtp();
    user.passwordResetOtp = otpGenerated;
    (user.otpExpires = moment().add(10, "minutes")), await user.save();
    const otpBody = `${otpGenerated} is your OTP to login to ShoezBazaar. DO NOT share otp with anyone. SHOEZBAZAAR never ask for OTP. This otp expires in 10 mins.`;
    try {
      const token = await generateToken(user?._id);
      await User.findByIdAndUpdate(
        user?.id,
        {
          token: token,
          lastLogin: new Date(),
        },
        { $new: true }
      );

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      // sendOTP(otpBody, mobile);
      return res.status(204).json("OTP Sent Successfully!");
    } catch (error) {
      console.log(error);
    }
  } else {
    // user donot exists
    let newUser = new User({ mobile });
    try {
      const otpGenerated = await newOtp();
      newUser.passwordResetOtp = otpGenerated;
      newUser.otpExpires = moment().add(10, "minutes");
      // currenlty storing the mob num in place of email because of mongodb error
      newUser.email = mobile;
      const savedUser = await User.create(newUser);
      const token = await generateToken(savedUser?.id);
      await User.findByIdAndUpdate(
        savedUser?.id,
        {
          token: token,
          lastLogin: new Date(),
        },
        { $new: true }
      );
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      const otpBody = `${otpGenerated} is your OTP to login to ShoezBazaar. DO NOT share otp with anyone. SHOEZBAZAAR never ask for OTP. This otp expires in 10 mins.`;
      try {
        // sendOTP(otpBody, mobile);  uncomment this to start otp service
        return res.status(204).json("OTP Sent Successfully!");
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
};

exports.otpLogin = async (req, res) => {
  const mobile = req.body.mobile;
  const otp = req.body.otp;

  try {
    const user = await User.findOne({
      mobile: mobile,
      passwordResetOtp: otp,
    });

    if (!user) {
      return res.status(400).json("Invalid Otp!");
    }
    if (moment().isAfter(user.otpExpires)) {
      return res.status(410).json({ message: "OTP has expired" });
    }
    user.passwordResetOtp = "";
    user.otpExpires = "";
    await user.save();
    return res.status(200).json(user.token);
  } catch (error) {
    console.log(error);
  }
};
