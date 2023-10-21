import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { countSize } from "../utils/helper.js";
import { useOutletContext } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import PaymentGatewayForm from "./PaymentGatewayForm";
const stripePromise = loadStripe(process.env.REACT_PUBLISHABLE_KEY);
export default function Checkout() {
  const [, user] = useOutletContext();
  const cart = useSelector((store) => store.cart);
  const restaurant = cart.restaurantDetails;
  const cartItems = cart.items;
  const [clientSecret, setClientSecret] = useState("");
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (user) {
      let amountArr = cartItems.map((item) => {
        if (item.selectedOptions?.size) {
          let count = countSize(item.selectedOptions.size);
          return count * (item.price / 100);
        } else return (item.price / 100) * item.selectedQty;
      });
      let amount = amountArr.reduce((amt, curr) => amt + curr, 0);
      let delivery = restaurant?.feeDetails?.totalFee / 100;
      let gst = (amount * 5) / 100;
      setTotal(amount + gst + delivery + 3);
      fetchClientSecret();
    }
  }, [cartItems]);

  async function fetchClientSecret() {
    let res = await fetch("/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cartItems,
        restaurantInfo: restaurant,
      }),
    });
    let data = await res.json();
    setClientSecret(data.clientSecret);
  }
  if (!user) return <h1>404-Not Found</h1>;
  if (!cartItems.length) return null;
  return (
    <article className="checkout-page flex p-5">
      <section className="user-info">Some lorem ipsum address</section>
      <p>Total Bill: {total}</p>
      {clientSecret && (
        <Elements
          options={{ clientSecret, appearance: { theme: "stripe" } }}
          stripe={stripePromise}
        >
          <PaymentGatewayForm />
        </Elements>
      )}
    </article>
  );
}
