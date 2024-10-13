import { Discount, DiscountStatusEnum } from "../model/Discount.model.js";
import { Transaction } from "../model/Transaction.model.js";



const getTaxAmount = async (transactionId) => {
  try {
    const transaction = await Transaction.findById(transactionId)
    const discounts = await Discount.find({
      transactionId: transactionId,
      discountStatus: DiscountStatusEnum.APPLIED
    })

    let appliedDiscounts = 0;
    for (let discount of discounts) {
      appliedDiscounts = appliedDiscounts + discount.amount
    }

    let taxableAmount = transaction.amount - appliedDiscounts;
    return (taxableAmount * 0.18);
  } catch (error) {
    console.log(error)
  }

}


const getTotalAmount = async (transactionId) => {
  try {
    const transaction = await Transaction.findById(transactionId)
    const discounts = await Discount.find({
      transactionId: transactionId,
      discountStatus: DiscountStatusEnum.APPLIED
    })

    let appliedDiscounts = 0;
    for (let discount of discounts) {
      appliedDiscounts = appliedDiscounts + discount.amount
    }

    return (transaction.amount - appliedDiscounts + transaction.taxAmount);

  } catch (error) {
    console.log(error)
  }
}


export  { getTaxAmount, getTotalAmount }