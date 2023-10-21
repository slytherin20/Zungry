const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
app.use(bodyParser.json());
dotenv.config();
const serverPort = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_SECRETAPI_KEY);

async function calculateAmount(restaurantInfo, items) {
  let deliveryCharges = restaurantInfo.feeDetails.totalFee;
  let amountArr = items.map((item) => {
    if (item.selectedOptions?.size) {
      let count = countSize(item.selectedOptions.size);
      return count * item.price;
    } else return item.price * item.selectedQty;
  });
  let amount = amountArr.reduce((amt, curr) => amt + curr, 0);
  let gst = (amount * 5) / 100;

  return amount + deliveryCharges + 300 + gst; //Platform fees is Rs.3
}
function countSize(sizeTypes) {
  return Object.keys(sizeTypes).reduce(
    (count, sizeType) => count + sizeTypes[sizeType],
    0
  );
}
app.post("/create-payment-intent", async (req, res) => {
  let amount = await calculateAmount(req.body.restaurantInfo, req.body.items);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "inr",
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "../dist", "index.html"))
);

app.listen(serverPort, () => {
  console.log("Server running on port", serverPort);
});
