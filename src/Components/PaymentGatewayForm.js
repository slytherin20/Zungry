import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { LOADING_ICON } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PaymentGatewayForm({ profileDetails }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!profileDetails.mobile || !profileDetails.address) navigate("/account");
    setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    const err = result.error;
    if (err) {
      if (err.type == "card_error" || err.type == "validation_error")
        toast.error(err.message);
      else toast.error("Payment failed");
    } else {
      toast.success("Payment Successful!");
      navigate("/");
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
    </form>
  );
}
