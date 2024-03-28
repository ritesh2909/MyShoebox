const Stripe = require("stripe");
const { successOrder, failedOrder } = require("./order")
function roundToTwoDecimals(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

exports.createPayment = async (req, res) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const { amount } = req.body;
  let roundedAmount = roundToTwoDecimals(amount * 100);
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
          unit_amount: roundedAmount,
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


exports.stripeWebhook = async (req, res) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const sessionId = req.query.session_id;
  console.log(sessionId)
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'paid') {
      console.log("payment success")
    } else {
      // await failedOrder();
      console.log("payment failed")
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json("Internal Serevr Error")
  }
};