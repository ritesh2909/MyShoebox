const { Order, OrderStatusEnum } = require("../model/Order");
const { OrderItem } = require("../model/OrderItem");
const { Transaction } = require("../model/Transaction")
const { CartItem, CartItemStatus } = require("../model/CartItem")
const { getCartItems } = require("./cart");

function generateOrderId(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.successOrder = async (req, res) => {
  try {
    let currentUser = res.user;
    let cartDetails = await getCartItems(req, res)
    let cartItems = cartDetails.cartItem;
    let transaction = cartDetails.transaction;

    const newOrder = await Order.create({
      orderStatus: OrderStatusEnum.ORDERED,
      orderId: generateOrderId(),
      orderAmount: transaction.totalAmount,
      orderDate: new Date(),
      instructions: req.body.instructions,
      transactionId: transaction._id,
    })

    for (let item of cartItems) {
      if (item.productInfoId.availabilityStatus != 1) {
        continue;
      }
      const newOrderItem = await OrderItem.create({
        orderId: newOrder._id,
        userId: currentUser._id,
        productInfo: {
          title: item.productInfoId.title,
          description: item.productInfoId.description,
          productId: item.productInfoId.productId,
          color: item.productInfoId.color,
          size: item.productInfoId.size,
          quantity: item.productInfoId.quantity,
          thumbnail: item.productInfoId.thumbnail,
          purchasedPrice: item.productInfoId.discountPrice,
        }
      })
      await CartItem.findByIdAndUpdate(item._id, {
        status: CartItemStatus.ORDERED
      })
    }

    await Transaction.findByIdAndUpdate(transaction._id, {
      isCompleted: true,
    });
  } catch (error) {
    console.log(err)
    return res.status(500).json(error)
  }
}

exports.failedOrder = async (req, res) => {
  try {
    let currentUser = res.user;
    let cartDetails = await getCartItems(req, res)
    let cartItems = cartDetails.cartItem;
    let transaction = cartDetails.transaction;

    const newOrder = await Order.create({
      orderStatus: OrderStatusEnum.PAYMENT_FAILED,
      orderId: generateOrderId(),
      orderAmount: transaction.totalAmount,
      orderDate: new Date(),
      instructions: req.body.instructions,
      transactionId: transaction._id,
    })

    for (let item of cartItems) {
      if (item.productInfoId.availabilityStatus != 1) {
        continue;
      }
      const newOrderItem = await OrderItem.create({
        orderId: newOrder._id,
        userId: currentUser._id,
        productInfo: {
          title: item.productInfoId.title,
          description: item.productInfoId.description,
          productId: item.productInfoId.productId,
          color: item.productInfoId.color,
          size: item.productInfoId.size,
          quantity: item.productInfoId.quantity,
          thumbnail: item.productInfoId.thumbnail,
          purchasedPrice: item.productInfoId.discountPrice,
        }
      })
      await CartItem.findByIdAndUpdate(item._id, {
        status: CartItemStatus.PAYMENT_FAILED,
      })
    }

    await Transaction.findByIdAndUpdate(transaction._id, {
      isCompleted: true,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}