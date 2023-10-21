import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect } from "react";
import { useState } from "react";
import { LOADING_ICON } from "../utils/constants";

export default function PaymentGatewayForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) return;
    let clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMsg("Payment Successfull");
          break;
        case "processing":
          setMsg("Your payment is processing");
          break;
        case "requires_payment_method":
          setMsg("Your payment was not successfull. PLease try again!");
          break;
        case "canceled":
          setMsg("Payment canceled");
          break;
      }
    });
  }, [stripe]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);

    const { err } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5000/success",
      },
    });
    if (err.type == "card_error" || err.type == "validation_error")
      setMsg(err.message);
    else setMsg("An unexpected error occurred.");

    setIsLoading(false);
  }
  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: "tabs" }} id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} type="submit">
        {isLoading ? (
          <span className="spinner animate-spin" id="spinner">
            <img src={LOADING_ICON} alt="loading" width="20" height="20" />
          </span>
        ) : (
          <span>Pay Now</span>
        )}
      </button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
