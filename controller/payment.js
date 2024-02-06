const Stripe = require("stripe");

exports.createPayment = async (req, res) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const { products } = req.body;
  console.log(products);
  let stripeLineItems = [];
  for (let product of products) {
    let stripeLineItem = {
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    };
    stripeLineItems.push(stripeLineItem);
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: stripeLineItems,
    mode: "payment",
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel",
  });
  res.json({ id: session.id });
};
// {
//   name,
//   price,
//   quantity,
// }
