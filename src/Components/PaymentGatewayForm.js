import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect } from "react";
import { useState } from "react";
import { LOADING_ICON } from "../utils/constants";
import { useNavigate } from "react-router-dom";

export default function PaymentGatewayForm({ profileDetails }) {
  const stripe = useStripe();
  const elements = useElements();
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!stripe) return;
    let clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      console.log("status", paymentIntent.status);
      switch (paymentIntent.status) {
        case "succeeded":
          setMsg("Payment Successful");
          break;
        case "processing":
          setMsg("Your payment is processing");
          break;
        case "requires_payment_method":
          setMsg("Your payment was not successfull. Please try again!");
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
    if (!profileDetails.mobile || !profileDetails.address) navigate("/account");
    setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5000/success",
      },
    });
    const err = result.error;
    if (err) {
      if (err.type == "card_error" || err.type == "validation_error")
        setMsg(err.message);
      else setMsg("An unexpected error occurred.");
    }

    setIsLoading(false);
  }
  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: "tabs" }} id="payment-element" />
      <button
        disabled={
          isLoading ||
          !stripe ||
          !elements ||
          !profileDetails.mobile ||
          !profileDetails.address
        }
        type="submit"
        className="w-60 h-8 text-white bg-blue-800 rounded-md flex justify-center items-center"
      >
        {isLoading || !stripe || !elements ? (
          <div className="spinner w-5 h-5 animate-spin" id="spinner">
            <img src={LOADING_ICON} alt="loading" width="20" height="20" />
          </div>
        ) : (
          <span>Pay Now</span>
        )}
      </button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
