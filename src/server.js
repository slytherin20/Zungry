import express from "express";
const app = express();
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { fileURLToPath } from "url";
dotenv.config();
const serverPort = process.env.PORT || 5000;
import Stripe from "stripe";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stripe = Stripe(process.env.STRIPE_SECRETAPI_KEY);
const ServiceAccount = {
  type: "service_account",
  project_id: process.env.REACT_APP_PROJECTID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};
initializeApp({
  credential: cert(ServiceAccount),
});
const db = getFirestore();

async function calculateAmount(totalFee, items) {
  let deliveryCharges = totalFee || 0;
  let amountArr = items.map((item) => {
    if (item.selectedOptions?.size) {
      let count = countSize(item.selectedOptions.size);
      return count * (item.defaultPrice ? item.defaultPrice : item.price);
    } else
      return (
        (item.defaultPrice ? item.defaultPrice : item.price) * item.selectedQty
      );
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
async function handleSuccessfulOrderPlaced(data) {
  let time = new Date().toLocaleString("en-GB"); //British date format: dd-mm-yyyy
  //Update order status to completed
  let profileDetails = db
    .collection("Users")
    .doc(data.id)
    .collection("Account")
    .doc("account");
  let profile = await profileDetails.get();

  const orderRef = db
    .collection("Users")
    .doc(data.id)
    .collection("orders")
    .doc(data.orderId);

  await orderRef.update({
    status: "completed",
    time,
    profile: profile.data(),
  });
  //clear cart and restaurant
  let restaurantRef = db
    .collection("Users")
    .doc(data.id)
    .collection("restaurantInfo")
    .doc("restaurant");
  await restaurantRef.delete();
  const cartRef = db.collection("Users").doc(data.id).collection("cart");
  let querySnapshotCart = await cartRef.get();
  let itemsId = [];
  querySnapshotCart.forEach((doc) => itemsId.push(doc.id));
  itemsId.forEach(async (id) => {
    let itemRef = db
      .collection("Users")
      .doc(data.id)
      .collection("cart")
      .doc(id);
    await itemRef.delete();
  });
}
async function handleFailedPayment(data) {
  let time = new Date().toLocaleString();
  const orderRef = db
    .collection("Users")
    .doc(data.id)
    .collection("orders")
    .doc(data.orderId);

  await orderRef.update({
    status: "failed",
    time,
  });
}
app.post(
  "/create-payment-intent",
  bodyParser.json({ type: "application/json" }),
  async (req, res) => {
    try {
      let amount = await calculateAmount(req.body.totalFee, req.body.items);
      amount = Math.round(amount);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "inr",
        metadata: {
          orderId: req.body.orderId,
          id: req.body.id,
        },
      });
      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
);
const endpointSecret = process.env.WEBHOOK_SECRET;
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  let event;
  const sig = req.headers["stripe-signature"];
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
  switch (event.type) {
    case "payment_intent.succeeded": {
      try {
        const paymentIntent = event.data.object;
        console.log(`Payment for ${paymentIntent.id} is successful`);
        handleSuccessfulOrderPlaced(paymentIntent.metadata);
      } catch (err) {
        console.log(
          "Experienced unexpected error while trying to add order:",
          err.message
        );
        res.status(400).json({ error: err.message });
      }
      break;
    }
    case "payment_intent.payment_failed":
      {
        try {
          console.log("Payment failed");
          const paymentIntent = event.data.object;
          handleFailedPayment(paymentIntent.metadata);
        } catch (err) {
          console.log("Failure updating order status to Failed");
          res.status(400).json({ error: err.message });
        }
      }
      break;
  }
  res.status(200).send("Success");
});

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "../dist", "index.html"))
);

app.listen(serverPort, () => {
  console.log("Server running on port", serverPort);
});
