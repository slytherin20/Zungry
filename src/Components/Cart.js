import { useSelector } from "react-redux";
import DishCard from "./DishCard";
import { useOutletContext } from "react-router-dom";
import { CLOUDANARY_API, STAR_ICON } from "../utils/constants";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { calculateBillDetails } from "../utils/helper";

function Cart() {
  let cartItems = useSelector((store) => store.cart.items);
  let restaurant = useSelector((store) => store.cart.restaurantDetails);
  let account = useSelector((store) => store.account.profileDetails);
  const [, user] = useOutletContext();
  const [details, setDetails] = useState({});

  useEffect(() => {
    if (cartItems.length) {
      let { delivery, amount, gst } = calculateBillDetails(
        cartItems,
        restaurant
      );
      setDetails({
        delivery,
        amount,
        gst,
      });
    }
  }, [cartItems]);
  if (!cartItems.length || !restaurant) return <section>Cart is empty</section>;
  return (
    <article className="checkout-page flex p-5 flex-wrap justify-between sm:flex-row flex-col ">
      <div className="flex flex-col  w-full sm:w-2/4 border-2 border-slate-300 rounded-md">
        <Link to={"/restaurants/" + restaurant.id}>
          <section className="restaurant flex mb-3">
            <img
              src={CLOUDANARY_API + restaurant?.cloudinaryImageId}
              alt={restaurant?.name + " logo"}
              width="150"
              height="150"
            />
            <div className="info pl-4">
              <h1 className="text-xl">{restaurant?.name}</h1>
              <p>
                {restaurant?.locality
                  ? restaurant?.locality +
                    ", " +
                    restaurant?.areaName +
                    ", " +
                    restaurant?.city
                  : ""}
              </p>
              <div>
                <div
                  className={
                    restaurant.avgRating >= 4
                      ? "bg-green-900 h-4 w-4 inline-block"
                      : restaurant.avgRating >= 3
                      ? "bg-green-600 h-4 w-4 inline-block"
                      : restaurant.avgRating >= 2
                      ? "bg-yellow-500 h-4 w-4 inline-block"
                      : "bg-red-600 h-4 w-4 inline-block"
                  }
                >
                  <img
                    src={STAR_ICON}
                    alt="rating"
                    className="h-3 w-3 m-auto"
                  />
                </div>
                <span>
                  {restaurant?.avgRating > 0
                    ? restaurant?.avgRating + " stars, "
                    : "--"}
                </span>
                <span>{restaurant?.sla?.deliveryTime} mins delivery time</span>
              </div>
            </div>
          </section>
        </Link>
        <hr></hr>
        <section className="items">
          {cartItems.map((item) => (
            <DishCard
              dish={item}
              restaurantInfo={restaurant}
              key={item.id}
              user={user}
            />
          ))}
        </section>
      </div>
      <div className="bill-details w-full sm:w-2/5 p-6">
        <section className="bil-info">
          <h1 className="text-lg">Bill Details</h1>
          <div className="border-t-2 flex flex-col ">
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
              <span>To Pay</span>
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

        {user && account?.address && account?.mobile ? (
          <Link to="/checkout">
            <button className="bg-green-900 w-32 h-8 text-white p-1 rounded-md float-right">
              Checkout {" >>"}
            </button>
          </Link>
        ) : (
          user && (
            <Link to="/account">
              <button className="bg-green-900 w-32 h-8 text-white p-1 rounded-md float-right">
                Checkout {" >>"}
              </button>
            </Link>
          )
        )}
        {!user && (
          <Link to="/login">
            <button className="bg-green-900 w-32 h-8 text-white p-1 rounded-md float-right">
              Checkout {" >>"}
            </button>
          </Link>
        )}
      </div>
    </article>
  );
}

export default Cart;
