import { CartItem, CartItemStatus } from "../model/CartItem.model.js";
import { Discount, DiscountEntityEnum, DiscountStatusEnum } from "../model/Discount.model.js";
import { ProductInfo } from "../model/ProductInfo.model.js";
import { Transaction } from "../model/Transaction.model.js";
import { getTaxAmount, getTotalAmount } from "../utils/calculations.js";


export async function addToCart(req, res) {
  let currentUser = res.user;
  const productInfoId = req.params.productInfoId;
  const quantity = req.body.quantity;

  try {
    const productInfo = await ProductInfo.findById(productInfoId)
    if (!productInfo) {
      return res.status(404).json("product not found!")
    }

    let transaction = await Transaction.findOne({
      userId: currentUser._id,
      isCompleted: false
    })

    if (!transaction) {
      // creating a new transaction
      transaction = await Transaction.create({
        userId: currentUser._id,
        amount: 0,
        totalAmount: 0,
        taxAmount: 0,
        isCompleted: false
      })
    }

    const existingCartItem = await CartItem.findOne({
      user: currentUser._id,
      productInfoId: productInfoId,
      status: CartItemStatus.ADDED,
    });

    if (existingCartItem) {
      // item already exists in the cart, increasing the number
      existingCartItem.quantity = existingCartItem.quantity + quantity;
      await existingCartItem.save();
    } else {
      // adding new item to cart
      const newCartItem = await CartItem.create({
        userId: currentUser._id,
        productInfoId: productInfoId,
        quantity: quantity,
        status: CartItemStatus.ADDED
      })
    }

    for (let i = 0; i < quantity; i++) {
      const _ = await Discount.create({
        userId: currentUser._id,
        transactionId: transaction._id,
        amount: productInfo.price - productInfo.discountPrice,
        entityType: DiscountEntityEnum.DISCOUNT,
        entity_id: productInfoId,
        discountStatus: DiscountStatusEnum.APPLIED
      })
    }



    transaction.amount = transaction.amount + (productInfo.price * quantity);
    await transaction.save();
    transaction.taxAmount = await getTaxAmount(transaction._id);
    await transaction.save()
    transaction.totalAmount = await getTotalAmount(transaction._id);
    await transaction.save();
    return res.status(200).json("Product added to your cart")
  } catch (error) {
    console.log(error)
    return res.status(500).json("Internal Server Error")
  }
}

export async function removeFromCart(req, res) {
  let currentUser = res.user;
  const productInfoId = req.params.productInfoId;

  try {
    const productInfo = await ProductInfo.findById(productInfoId)
    if (!productInfo) {
      return res.status(404).json("product not found!")
    }

    const transaction = await Transaction.findOne({
      userId: currentUser._id,
      isCompleted: false
    })

    if (!transaction) {
      return res.status(400).json("users transaction not found")
    }

    const cartItem = await CartItem.findOne({
      userId: currentUser._id,
      productInfoId: productInfoId,
      status: CartItemStatus.ADDED,
    })

    if (cartItem.quantity == 1) {
      // last item 
      cartItem.status = CartItemStatus.REMOVED
      await cartItem.save();
    } else {
      // have more items
      cartItem.quantity--;
      await cartItem.save();
    }

    await Discount.findOneAndUpdate({
      userId: currentUser._id,
      transactionId: transaction._id,
      entity_id: productInfoId,
      discountStatus: DiscountStatusEnum.APPLIED
    }, {
      discountStatus: DiscountStatusEnum.REMOVED
    })

    transaction.amount = transaction.amount - productInfo.price;
    await transaction.save();
    transaction.taxAmount = await getTaxAmount(transaction._id);
    await transaction.save();
    transaction.totalAmount = await getTotalAmount(transaction._id);

    await transaction.save();
    return res.status(200).json("Product removed from cart")
  } catch (error) {
    return res.status(500).json(error);
  }
}

// this will return 2 things cart items and transaction details, transaction details will be regenerated again because of price volitility
export async function getCartItems(req, res) {
  let currentUser = res.user;
  try {
    const cartItems = await CartItem.find({
      userId: currentUser._id,
      status: CartItemStatus.ADDED
    }).populate({
      path: 'productInfoId',
      select: 'availabilityStatus title _id description productId color size quantity thumbnail price discountPrice rating'
    });


    if (cartItems.length == 0) {
      return res.status(200).json({
        cartItem: [],
        transaction: {}
      }
      )
    }

    let transaction = await Transaction.findOne({
      userId: currentUser._id,
      isCompleted: false
    })
    if (!transaction) {
      // creating a new transaction
      transaction = await Transaction.create({
        userId: currentUser._id,
        amount: 0,
        totalAmount: 0,
        taxAmount: 0,
        isCompleted: false
      })
    }

    let amount = 0;
    let graceAmount = 0;
    for (let item of cartItems) {
      let productInfo = await ProductInfo.findById(item.productInfoId)
      amount += productInfo.price;
      graceAmount += productInfo.discountPrice;
      const discount = await Discount.findOne({
        userId: currentUser._id,
        transactionId: transaction._id,
        entity_id: productInfo._id,
        entityType: DiscountEntityEnum.DISCOUNT
      })

      discount.amount = productInfo.price - productInfo.discountPrice
      await discount.save();
    }
    transaction.amount = amount;
    await transaction.save();
    transaction.taxAmount = await getTaxAmount(transaction._id);
    await transaction.save();
    transaction.totalAmount = await getTotalAmount(transaction._id);

    await transaction.save();

    const pipeline = [
      {
        $match: { transactionId: transaction._id, discountStatus: DiscountStatusEnum.APPLIED },
      },
      {
        $group: {
          _id: '$entityType',
          totalAmount: { $sum: '$amount' },
          entityType: { $first: '$entityType' },
        }
      }
    ];

    const discounts = await Discount.aggregate(pipeline);
    const transactionWithDiscount = {
      ...transaction._doc,
      discounts: discounts
    };
    // console.log(discounts)
    const cartResponse = {
      cartItem: cartItems,
      transaction: transactionWithDiscount
    }

    return res.status(200).json(cartResponse);

  } catch (error) {
    console.log(error)
    return res.status(500).json(error);
  }
}

export async function moveToWishList(req, res) {
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
}

export async function getCheckoutInfo(req, res) {
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
}
