import { useSelector } from "react-redux";
import DishCard from "./DishCard";
import { useOutletContext } from "react-router-dom";

function Cart() {
  let cartItems = useSelector((store) => store.cart.items);
  let restaurant = useSelector((store) => store.cart.restaurantDetails);
  const [, user] = useOutletContext();
  if (!cartItems.length) return null;
  return (
    <div>
      {cartItems.map((dish) => (
        <DishCard
          dish={dish}
          restaurantInfo={restaurant}
          user={user}
          key={dish?.id}
        />
      ))}
    </div>
  );
}

export default Cart;
