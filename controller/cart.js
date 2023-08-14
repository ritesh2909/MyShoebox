const { Cart } = require("../model/Cart");

exports.getCartByUserId = async (req, res) => {
  const userId = req.params;
  try {
    const cart = await Cart.findOne({ userId: userId });
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

exports.addToCart = async (req, res) => {
  const cart = new Cart(req.body);
  try {
    const newCart = await cart.save();
    return res.status(200).json(newCart);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};
