import { Order, OrderStatusEnum } from "../model/Order.model.js";
import { OrderItem } from "../model/OrderItem.model.js";
import { Transaction } from "../model/Transaction.model.js";
import { CartItem, CartItemStatus } from "../model/CartItem.model.js";
import { getCartItems } from "./cart.controller.js";

function generateOrderId(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function successOrder(req, res) {
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
    console.log(error)
    return res.status(500).json(error)
  }
}

export async function failedOrder(req, res) {
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