const { User } = require("../model/User");

exports.registerUser = async (req, res) => {
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    return res.status(200).json(savedUser);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id, "email name id");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};
