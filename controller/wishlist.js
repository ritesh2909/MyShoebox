const { Product } = require("../model/Product");
const { User } = require("../model/User");
const { WishListItem } = require("../model/WishListItem");
const { ProductInfo } = require("../model/ProductInfo");
const { CartItem } = require("../model/CartItem");

exports.addToWishList = async (req, res) => {
  try {
    const color = req.body.color;
    const size = req.body.size;
    const productId = req.params.productId;
    const currentUser = res.user;
    const userId = currentUser._id;
    const product = await Product.findOne({ productId: productId });
    if (!product) {
      return res.status(404).json("Product not found!");
    }
    const userInfo = await User.findOne({ _id: userId });
    if (!userInfo) {
      return res.status(404).json("User not found!");
    }

    const wishListItem = await WishListItem.findOne({
      userId: userId,
      productId: productId,
      color: color,
      size: size,
    });

    if (wishListItem) {
      // item is already there
      return res.status(200).json("Item added to Wishlist");
    } else {
      // adding a new item in wishlist
      const newWishListItem = new WishListItem({
        userId: userId,
        productId: productId,
        color: color,
        size: size,
      });
      const savedNewWishListItem = await newWishListItem.save();
      userInfo.wishList.push(savedNewWishListItem._id);
      await userInfo.save();
    }
    return res.status(200).json("Product Added to wishlist!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.removeFromWishList = async (req, res) => {
  try {
    const productId = req.params.productId;
    const currentUser = res.user;
    const userId = currentUser._id;
    const color = req.body.color;
    const size = req.body.size;
    const product = await Product.findOne({ productId: productId });
    if (!product) {
      return res.status(404).json("Product not found!");
    }
    const userInfo = await User.findOne({ _id: userId });
    if (!userInfo) {
      return res.status(404).json("User not found!");
    }
    const wishListItem = await WishListItem.findOne({
      productId: productId,
      userId: userId,
      color: color,
      size: size,
    });

    if (!wishListItem) {
      return res.status(200).json("Item Already removed");
    }
    userInfo.wishList = userInfo.wishList.filter(
      (item) => item != wishListItem._id
    );
    await WishListItem.findByIdAndDelete(wishListItem._id);
    await userInfo.save();

    return res.status(200).json("Product removed from Wishlist!");
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getWishListProducts = async (req, res) => {
  try {
    const currentUser = res.user;
    const userId = currentUser._id;
    const userInfo = await User.findOne({ _id: userId });
    let products = [];
    let wishList = await WishListItem.find({userId: userId});
    for (let wishListItem of wishList) {
      const wishListDet = await WishListItem.findOne({
        _id: wishListItem,
      });
      if (wishListDet) {
        const productDetail = await Product.findOne({
          productId: wishListDet.productId,
        });
        const productInfo = await ProductInfo.findOne({
          productId: wishListDet.productId,
          color: wishListDet.color,
          size: wishListDet.size,
        });
        const productVarients = await ProductInfo.find(
          {
            productId: wishListDet.productId,
            color: wishListDet.color,
          },
          "size"
        );
        products.push({
          wishListItem: wishListDet,
          productDetail,
          productInfo: productInfo,
          varient: productVarients,
        });
      }
    }

    return res
      .status(200)
      .json({ products: products, productInfo: {}, count: products.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

exports.moveToCart = async (req, res) => {
  const id = req.params.id;
  const wishListItem = await WishListItem.findById(id);

  const product = await Product.findOne({ productId: wishListItem.productId });
  if (!product) {
    return res.status(404).json("Product not found!");
  }
  if (!wishListItem) {
    return res.status(404).json("Wishlist item not found!");
  }
  const productVarient = await ProductInfo.findOne({
    productId: wishListItem.productId,
    size: req.body.size,
    color: req.body.color,
  });

  if (!productVarient) {
    return res.status(404).json("Product Unavailable!");
  }

  try {
    const cartItem = await CartItem.findOne({
      userId: wishListItem.userId,
      productId: wishListItem.productId,
      size: req.body.size,
      color: req.body.color,
    });

    if (cartItem) {
      // item is already present in cart
      //  remove item from wishlist
      await WishListItem.findByIdAndDelete(id);
      return res.status(200).json("Item added to your cart!");
    } else {
      // create a new cart item and then procceed
      const newCartItem = new CartItem({
        userId: wishListItem.userId,
        productId: wishListItem.productId,
        size: req.body.size,
        color: req.body.color,
        quantity: 1,
      });
      await newCartItem.save();
    }

    // removing from
    await WishListItem.findByIdAndDelete(id);
    return res.status(204).json("Item added to cart!");
  } catch (error) {
    return res.status(500).json(error);
  }
};

// v2 apis
exports.V2RemoveFromWishList = async (req, res) => {
  const itemId = req.params.id;
  const wishListItem = await WishListItem.findById(itemId);
  if (!wishListItem) {
    return res.status(404).json("Wishlist item not found!");
  }

  try {
    await WishListItem.findByIdAndDelete(itemId);
    return res.status(204).json("Item removed from wishlist!");
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getWishListProductsV2 = async (req, res) => {};
