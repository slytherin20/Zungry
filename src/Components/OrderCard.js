import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { addRestaurantToDB, addToDBCart } from "../utils/firestore_utils";
import { useSelector } from "react-redux";
import Modal from "./Modal";
import { ReplaceItemsPopup } from "./ReplaceItemsPopup";
import { OrderDetails } from "./OrderDetails";
import RatingOrder from "./RatingOrder";

export default function OrderCard({ order, user }) {
  const [replaceCart, setReplaceCart] = useState(false);
  const cart = useSelector((store) => store.cart);
  const [isReorder, setIsReorder] = useState(false);
  const [details, setDetails] = useState(false);
  const navigate = useNavigate();

  function toggleDetailsHandler() {
    setDetails(!details);
  }

  useEffect(() => {
    if (isReorder) {
      navigate("/cart");
    }
  }, [cart.items]);

  function replaceCartHandler() {
    setReplaceCart(!replaceCart);
  }
  async function reorderItem() {
    setIsReorder(true);
    if (cart.items.length > 0) {
      if (cart.restaurantDetails.id == order.restaurant.id) {
        order.items.forEach((item) => addToDBCart(item, user));
      } else {
        setReplaceCart(true);
      }
    } else {
      addRestaurantToDB(order.restaurant, user);
      order.items.forEach((item) => addToDBCart(item, user));
    }
  }
  return (
    <section key={order.id} className="border-t-4 border-black p-5">
      <p
        className={`text-center w-24 float-right border-2 rounded-md ${
          order.status == "completed" ? "border-green-600" : "border-red-700"
        }`}
      >
        {order.status}
      </p>
      <h3>
        <b>{order.restaurant.name}</b>
        <RatingOrder user={user} id={order.id} orderRating={order.rating} />
      </h3>
      <p className="text-base">{order.restaurant.locality}</p>
      <p className="text-sm">₹{order.totalAmount.toFixed(2)}/-</p>
      <hr></hr>
      <div className="flex justify-between items-center w-full flex-wrap">
        <div>
          <p>
            {order.items.map((item, i) => {
              if (i == order.items.length - 1) return "'" + item.name + "' ";
              else return "'" + item.name + "', ";
            })}
          </p>
          <p className="text-sm">{order.time}</p>
        </div>
        <div>
          <button
            type="button"
            className="text-white bg-red-700 rounded-md w-24 h-7 text-xs  mr-5"
            onClick={() => reorderItem(order.id)}
          >
            Reorder
          </button>
          <button
            type="button"
            className="text-white bg-red-700 rounded-md w-24 h-7 text-xs"
            onClick={toggleDetailsHandler}
          >
            View Details {">>"}
          </button>
        </div>
      </div>
      {replaceCart && cart && cart.restaurantDetails && (
        <Modal>
          <ReplaceItemsPopup
            from={
              cart.restaurantDetails.name == order.restaurant.name &&
              cart.restaurantDetails.id !== order.restaurant.id
                ? cart.restaurantDetails.name +
                  ", " +
                  cart.restaurantDetails.areaName
                : cart.restaurantDetails.name
            }
            to={
              cart.restaurantDetails.name == order.restaurant.name &&
              cart.restaurantDetails.id !== order.restaurant.id
                ? order.restaurant.name + ", " + order.restaurant.areaName
                : order.restaurant.name
            }
            toggleHandler={replaceCartHandler}
            user={user}
            dishes={order.items}
            restaurant={order.restaurant}
          />
        </Modal>
      )}
      {details && (
        <Modal>
          <OrderDetails
            order={order}
            toggleDetails={toggleDetailsHandler}
            user={user}
          />
        </Modal>
      )}
    </section>
  );
}
