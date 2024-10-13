import { Product } from "../model/Product.model.js";
import { User } from "../model/User.model.js";
import { WishListItem, WishListStatus } from "../model/WishListItem.model.js";
import { ProductInfo } from "../model/ProductInfo.model.js";
import { CartItem } from "../model/CartItem.model.js";

export async function addToWishList(req, res) {
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
      // userInfo.wishList.push(savedNewWishListItem._id);
      await userInfo.save();
    }
    return res.status(200).json("Product Added to wishlist!");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export async function removeFromWishList(req, res) {
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
}


export async function getWishListProducts(req, res) {
  try {
    const currentUser = res.user;
    const userId = currentUser._id;
    let products = [];
    let wishList = await WishListItem.find({ userId: userId, status: WishListStatus.ADDED });
    wishList.sort((a,b)=> b.createdAt - a.createdAt)
    for (let wishListItem of wishList) {
      const productInfo = await ProductInfo.findOne({
        _id: wishListItem.productInfoId
      });

      const productVarients = await ProductInfo.find(
        {
          productId: productInfo.productId,
          color: productInfo.color,
        },
        "size"
      );
      products.push({
        wishListItem: wishListItem,
        productInfo: productInfo,
        varient: productVarients,
      });

    }

    return res
      .status(200)
      .json({ products: products, count: products.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export async function moveToCart(req, res) {
  const id = req.params.id;
  const wishListItem = await WishListItem.findById(id);

  if (!wishListItem) {
    return res.status(404).json("Wishlist item not found!");
  }
  const productVarient = await ProductInfo.findById({ id: wishListItem.productInfoId })

  if (!productVarient) {
    return res.status(404).json("Product Unavailable!");
  }

  try {
    const cartItem = await CartItem.findOne({
      userId: wishListItem.userId,
      productInfoId: productVarient.id
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
        productInfoId: productVarient.id
      });
      await newCartItem.save();
    }

    // removing from
    await WishListItem.findByIdAndDelete(id);
    return res.status(204).json("Item added to cart!");
  } catch (error) {
    return res.status(500).json(error);
  }
}

// v2 apis
export async function V2RemoveFromWishList(req, res) {
  const itemId = req.params.id;
  const wishListItem = await WishListItem.findById(itemId);
  if (!wishListItem) {
    return res.status(404).json("Wishlist item not found!");
  }

  try {
    await WishListItem.findByIdAndUpdate(itemId, {
      status: WishListStatus.REMOVED
    });
    return res.status(204).json("Item removed from wishlist!");
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function V2AddToWishlist(req, res) {
  try {
    const productInfoId = req.params.productInfoId;
    const currentUser = res.user;
    const userId = currentUser._id;

    const productInfo = await ProductInfo.findById(productInfoId);

    if (!productInfo) {
      return res.status(404).json("Product not found!");
    }

    const existingProduct = await WishListItem.find({ userId: userId, productInfoId: productInfo.id, status: WishListStatus.ADDED })
    console.log(existingProduct);
    if (existingProduct.length > 0) {
      return res.status(200).json("Item already added to your wishlist!")
    } else {
      const newWishlistItem = new WishListItem({
        userId: userId,
        productInfoId: productInfoId,
        status: WishListStatus.ADDED
      })

      await newWishlistItem.save();
      return res.status(200).json("Item added to your wishlist!")
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json("Internal server error")
  }

}

export async function UpdateSize(req, res) {
  const productInfoId = req.params.productInfoId;
  const currentUser = res.user;
  const userId = currentUser._id;

  const productInfo = await ProductInfo.findById(productInfoId);

  if (!productInfo) {
    return res.status(404).json("Product not found!");
  }
}

