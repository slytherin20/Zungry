import { useEffect, useState } from "react";
import { getOrdersList } from "../utils/firestore_utils";
import { useOutletContext } from "react-router-dom";
import OrderCard from "./OrderCard";
import RouteError from "./RouteError";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  let [, user] = useOutletContext();

  useEffect(() => {
    user && fetchOrdersPlaced();
    async function fetchOrdersPlaced() {
      let ordersList = await getOrdersList(user);
      if (ordersList) setOrders(ordersList);
      else {
        console.log("Error", ordersList);
        //display unable to proceed request component
      }
    }
  }, [user]);
  function reorderItemHandler(orderId) {
    let order = orders.find((order) => order.id == orderId);
    console.log(order);
  }
  if (!user) return <RouteError />;
  return (
    <article className="w-10/12 m-auto mt-8">
      <h1 className="text-lg m-2">Orders</h1>
      {orders.length == 0 && (
        <section>
          <p>No orders placed</p>
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
