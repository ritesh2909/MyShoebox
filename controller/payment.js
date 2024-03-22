const Stripe = require("stripe");

exports.createPayment = async (req, res) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const { amount } = req.body;
  const environment = process.env.ENVIRONMENT;
  let successUrl, cancelUrl;

  if (environment == "prod") {
    successUrl = process.env.PROD_URL + "/success";
    cancelUrl = process.env.PROD_URL + "/cancel";
  } else {
    successUrl = process.env.DEV_URL + "/success";
    cancelUrl = process.env.DEV_URL + "/cancel";
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Payment",
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  res.json({ id: session.id });
};
