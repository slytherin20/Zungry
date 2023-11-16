import { useEffect, useState } from "react";
import { getOrdersList } from "../utils/firestore_utils";
import { useNavigate, useOutletContext } from "react-router-dom";
import OrderCard from "./OrderCard";
import SomethingWentWrong from "./SomethingWentWrong";
import { EMPTY_BAG } from "../utils/constants";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  let [, user] = useOutletContext();
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  useEffect(() => {
    user && fetchOrdersPlaced();
    async function fetchOrdersPlaced() {
      let ordersList = await getOrdersList(user);
      if (ordersList) setOrders(ordersList);
      else {
        setErr(true);
        console.log("Error", ordersList);
      }
    }
  }, [user]);
  function reorderItemHandler(orderId) {
    let order = orders.find((order) => order.id == orderId);
    console.log(order);
  }
  if (!user) navigate("/route-error");
  if (err) return <SomethingWentWrong />;
  return (
    <article className="w-10/12 m-auto mt-8">
      <h1 className="text-lg m-2">Orders</h1>
      {orders.length == 0 && (
        <section className="w-full flex flex-col items-center mt-24">
          <div className="w-64 h-64 relative">
            <img
              src={EMPTY_BAG}
              alt="A red colored bag for orders"
              className="w-32 h-32 rotate-142"
            />
            <p className="text-xl absolute bottom-20 left-24">
              No orders placed
            </p>
          </div>
        </section>
      )}
      {orders.length > 0 && (
        <section>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              reorderItem={reorderItemHandler}
              user={user}
            />
          ))}
        </section>
      )}
    </article>
  );
}
