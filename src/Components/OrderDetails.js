import {
  CLOSE_BTN,
  LOCATION_PIN,
  NONVEG_LOGO,
  VEG_LOGO,
} from "../utils/constants";
import { calculateBillDetails } from "../utils/helper";
import { Link } from "react-router-dom";
import RatingOrder from "./RatingOrder";
export function OrderDetails({ order, toggleDetails, user }) {
  let details = calculateBillDetails(order.items, order.restaurant);
  return (
    <article className="w-500 bg-white rounded-2xl p-5 max-h-vh overflow-auto">
      <section className="flex justify-between  border-b border-b-slate-500 mb-4">
        <h1 className="text-xl">Order #{order.id}</h1>
        <img
          src={CLOSE_BTN}
          alt="close order details button"
          className="float-right w-5 h-5 hover:cursor-pointer"
          onClick={toggleDetails}
        />
      </section>
      <section>
        <div className="flex  relative before:content-[''] before:h-7 before:border-l-2 before:border-dashed before:border-slate-400 before:absolute before:top-5 before:left-2">
          <img src={LOCATION_PIN} alt="location icon" className="h-5 w-5" />
          <div>
            <h1 className="flex items-center">
              <Link to={"/restaurants/" + order.restaurant.id}>
                <span className="mr-5 hover:text-red-700">
                  {order.restaurant.name}
                </span>
              </Link>
              <RatingOrder
                user={user}
                id={order.id}
                orderRating={order.rating}
              />
            </h1>
            <span className="text-sm text-gray-500">
              {order.restaurant.locality +
                ", " +
                order.restaurant.areaName +
                ", " +
                order.restaurant.city}
            </span>
          </div>
        </div>
        <div className="flex">
          <img src={LOCATION_PIN} alt="location icon" className="h-5 w-5" />
          <div>
            <h1>Delivery Address</h1>
            <span className="text-sm text-gray-500">
              {order.profile.address}
            </span>
          </div>
        </div>
      </section>
      <section className="mt-4">
        <h1 className="border-b-2 border-slate-300">Bill Details</h1>
        {order.items.map((item) => {
          return (
            <p key={item.id} className="text-sm flex justify-between m-2 ml-0">
              <span className="flex">
                {item.itemAttribute?.vegClassifier && (
                  <img
                    src={
                      item.itemAttribute?.vegClassifier === "VEG"
                        ? VEG_LOGO
                        : NONVEG_LOGO
                    }
                    alt={item.itemAttribute?.vegClassifier}
                    className="w-3 h-3 mt-t3 mr-2"
                  />
                )}
                <span className="flex flex-col">
                  {item.name} x
                  {item.selectedOptions?.size
                    ? Object.keys(item.selectedOptions.size).length
                    : item.selectedQty}
                  <span className="text-xs text-slate-500">
                    {item.selectedOptions?.size
                      ? Object.keys(item.selectedOptions.size).join(", ")
                      : null}
                  </span>
                </span>
              </span>

              <span>
                ₹
                {((item.price ? item.price : item.defaultPrice) / 100).toFixed(
                  2
                )}
              </span>
            </p>
          );
        })}
        <div className="border-t-2 border-t-gray-400 border-dashed text-sm">
          <p className="flex justify-between m-3">
            <span>Item Total</span>
            <span className="w-28">₹{details?.amount?.toFixed(2)}</span>
          </p>
          {details?.delivery ? (
            <p className="flex justify-between m-3">
              <span>Delivery Charges</span>
              <span className="w-28">₹{details?.delivery?.toFixed(2)}</span>
            </p>
          ) : null}
          <p className="flex justify-between m-3">
            <span>Platform Fees</span>
            <span className="w-28">₹3.00</span>
          </p>
          <p className="flex justify-between m-3">
            <span>GST</span>
            <span className="w-28">₹{details?.gst?.toFixed(2)}</span>
          </p>
          <hr></hr>
          <p className="flex justify-between m-3">
            <span>
              <b>Paid</b>
            </span>
            <span className="w-28">
              ₹
              {(
                details?.amount +
                details?.delivery +
                3 +
                details?.gst
              )?.toFixed(2)}
            </span>
          </p>
        </div>
      </section>
    </article>
  );
}
