const { generateToken } = require("../config/jwtToken");
const { User } = require("../model/User");

exports.registerUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(409).json({
      message: "User Already exists!",
      success: false,
    });
  }
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    return res.status(200).json(savedUser);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

exports.loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json("User not found!");
  }
  try {
    // todo secure password
    if (!(await user.isPasswordMatched(req.body.password))) {
      return res.status(401).json("Wrong credentials!");
    }
    return res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};
