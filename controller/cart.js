const { CartItem } = require("../model/CartItem");
const { ProductInfo } = require("../model/ProductInfo");
// const { WishListItem } = require("../model/WishListItem");

exports.addToCart = async (req, res) => {
  let currentUser = res.user;
  const productId = req.body.productId;
  const size = req.body.size;
  const color = req.body.color;

  try {
    if (!currentUser) {
      return res.status(401).json("Unauthenticated!");
    }
    const product = await ProductInfo.findOne({
      productId: productId,
    });
    if (!product) {
      return res.status(404).json("Product not found!");
    }

    // if item already exists, then increase counter
    const cartItemAlreadyExists = await CartItem.findOne({
      productId: productId,
      userId: currentUser._id,
      size: size,
      color: color,
    });

    if (!cartItemAlreadyExists) {
      // creating a new cartitem
      const newCartItem = new CartItem({
        userId: currentUser._id,
        productId: productId,
        color: color,
        size: size,
        quantity: 1,
      });
      await newCartItem.save();
    } else if (cartItemAlreadyExists && cartItemAlreadyExists.quantity < 5) {
      await CartItem.findByIdAndUpdate(cartItemAlreadyExists, {
        quantity: cartItemAlreadyExists.quantity + 1,
      });
    } else {
      //case where we already have 5 quantity of this product
      return res
        .status(400)
        .json("You have reached the maximum quantity of this product!");
    }
    return res.status(200).json("Product added to cart!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.removeFromCart = async (req, res) => {
  let currentUser = res.user;
  const cartItemId = req.params.cartItemId;

  try {
    const cartItem = await CartItem.findOne({
      _id: cartItemId,
      userId: currentUser._id,
    });
    if (!cartItem) {
      return res.status(404).json("Cart item not found!");
    }
    await CartItem.findByIdAndDelete(cartItemId);
    return res.status(200).json("Cart item removed!");
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getCartItems = async (req, res) => {
  let currentUser = res.user;
  try {
    const cartItems = await CartItem.find({ userId: currentUser._id });
    if (cartItems.length > 0) {
      for (let item of cartItems) {
        const productVarient = await ProductInfo.findOne({
          productId: item.productId,
          size: item.size,
          color: item.color,
        });

        Object.assign(item, productVarient);
      }
    }

    return res.status(200).json(cartItems);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.moveToWishList = async (req, res) => {
  // const id = req.params.id;
  // const cartItem = await CartItem.findById(id);
  // if (!cartItem) {
  //   return res.status(404).json("Cart Item not found!");
  // }
  try {
    let currentUser = res.user;
    return res.status(200).json(currentUser);
  } catch (error) {
    return res.status(500).json(error);
  }

  // try {
  //   const wishListItem = await WishListItem.findOne({});
  // } catch (error) {
  //   console.log(error);
  //   return res.status(500).json(error);
  // }
};

exports.getCheckoutInfo = async (req, res) => {
  try {
    const user = res.user;
    const cartItems = await CartItem.find({ userId: user._id.toString() });
    let grandTotal = 0;
    let totalMRP = 0;
    let isConvenienceFeesReq = false;
    for (let item of cartItems) {
      const productVarient = await ProductInfo.findOne({
        productId: item.productId,
        size: item.size,
        color: item.color,
      });
      if (item.reqConvenience === true) {
        isConvenienceFeesReq = true;
      }
      grandTotal += productVarient.discountPrice;
      totalMRP += productVarient.price;
    }

    const checkOutRes = {};
    let otherCharges = [];
    otherCharges.push({ "Total MRP": totalMRP });

    if (grandTotal <= 5000) {
      grandTotal += 40;
      otherCharges.push({ "Delivery Charges": 40 });
    }
    if (isConvenienceFeesReq) {
      gra += 40;
      otherCharges.push({ "Convenience Fees": 40 });
    }
    checkOutRes.otherCharges = otherCharges;
    checkOutRes.grandTotal = grandTotal;
    checkOutRes.totalMRP = totalMRP;
    return res.status(200).json(checkOutRes);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error!");
  }
};
