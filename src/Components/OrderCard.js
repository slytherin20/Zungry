import { EMPTY_STAR, FILLED_STAR } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addOrderRating,
  addRestaurantToDB,
  addToDBCart,
} from "../utils/firestore_utils";
import { useSelector } from "react-redux";
import Modal from "./Modal";
import { ReplaceItemsPopup } from "./ReplaceItemsPopup";

export default function OrderCard({ order, user }) {
  const [rating, setRating] = useState({
    stars: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    },
    value: 0,
  });
  const [replaceCart, setReplaceCart] = useState(false);
  const cart = useSelector((store) => store.cart);
  const [isReorder, setIsReorder] = useState(false);
  const navigate = useNavigate();
  function changeHoveredStars(e) {
    let id = e.target.id;
    let obj = {};
    [1, 2, 3, 4, 5].map((val) => {
      if (val <= id) {
        obj = {
          ...obj,
          [val]: true,
        };
      } else {
        obj = {
          ...obj,
          [val]: false,
        };
      }
    });
    setRating({
      stars: obj,
      value: rating.value,
    });
  }
  function clearHoveredStars() {
    setRating({
      stars: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      },
      value: rating.value,
    });
  }

  useEffect(() => {
    if (isReorder) {
      navigate("/cart");
    }
  }, [cart.items]);

  function addRating() {
    let count = 0;
    [1, 2, 3, 4, 5].forEach((val) => {
      if (rating.stars[val]) {
        count = count + 1;
      }
    });
    setRating({
      ...rating,
      value: count,
    });
    addOrderRating(user, order.id, count);
  }
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
        <div
          className="flex w-28"
          onClick={addRating}
          onMouseOut={clearHoveredStars}
        >
          {order.rating || rating.value > 0
            ? [1, 2, 3, 4, 5].map((val) => (
                <img
                  key={val}
                  src={
                    order.rating
                      ? val <= order.rating
                        ? FILLED_STAR
                        : EMPTY_STAR
                      : val <= rating.value
                      ? FILLED_STAR
                      : EMPTY_STAR
                  }
                  alt="rating star"
                  className="h-4 w-4 pr-1"
                />
              ))
            : [1, 2, 3, 4, 5].map((val) => (
                <img
                  key={val}
                  src={rating.stars[val] ? FILLED_STAR : EMPTY_STAR}
                  alt="rating star"
                  className="h-4 w-4 pr-1"
                  id={val}
                  onMouseOver={changeHoveredStars}
                />
              ))}
        </div>
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
          <Link to={"/orderDetails?id=" + order.id}>
            <button
              type="button"
              className="text-white bg-red-700 rounded-md w-24 h-7 text-xs"
            >
              View Details {">>"}
            </button>
          </Link>
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
    </section>
  );
}
