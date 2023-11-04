import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { countSize } from "../utils/helper.js";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import PaymentGatewayForm from "./PaymentGatewayForm";
import { createOrder } from "../utils/firestore_utils.js";
import AddressView from "./AddressView.js";
const stripePromise = loadStripe(process.env.REACT_PUBLISHABLE_KEY);
export default function Checkout() {
  const [, user] = useOutletContext();
  const cart = useSelector((store) => store.cart);
  const profileDetails = useSelector((store) => store.account.profileDetails);
  const restaurant = cart.restaurantDetails;
  const cartItems = cart.items;
  const [clientSecret, setClientSecret] = useState("");
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      let amountArr = cartItems.map((item) => {
        if (item.selectedOptions?.size) {
          let count = countSize(item.selectedOptions.size);
          return (
            count * ((item.defaultPrice ? item.defaultPrice : item.price) / 100)
          );
        } else
          return (
            ((item.defaultPrice ? item.defaultPrice : item.price) / 100) *
            item.selectedQty
          );
      });
      let amount = amountArr.reduce((amt, curr) => amt + curr, 0);
      let delivery = restaurant?.feeDetails?.totalFee / 100;
      let gst = (amount * 5) / 100;
      let totalRes = amount + gst + delivery + 3;
      setTotal(totalRes);
      let time = new Date().getTime();
      let orderId =
        String(time).slice(4) +
        user.slice(0, 4) +
        cartItems.length +
        String(time).slice(4);
      fetchClientSecret(orderId);
      createOrder(user, orderId, cartItems, restaurant, totalRes);
    }
  }, [cartItems]);

  async function fetchClientSecret(orderId) {
    try {
      let res = await fetch("/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          totalFee: restaurant?.feeDetails?.totalFee,
          id: user,
          orderId: orderId,
        }),
      });
      let data = await res.json();
      setClientSecret(data.clientSecret);
    } catch (err) {
      console.log("STRIPE ERROR: ", err.message);
    }
  }

  if (!user) return <h1>404-Not Found</h1>;
  if (!cartItems.length || !profileDetails) return null;
  if (!profileDetails.mobile) navigate("/account");
  return (
    <article className="checkout-page flex p-5">
      <AddressView profileDetails={profileDetails} />
      <section className="w-2/4">
        <p>
          <b>Total Bill:</b> {total.toFixed(2)}
        </p>
        {clientSecret && (
          <Elements
            options={{ clientSecret, appearance: { theme: "stripe" } }}
            stripe={stripePromise}
          >
            <PaymentGatewayForm profileDetails={profileDetails} />
          </Elements>
        )}
      </section>
    </article>
  );
}
