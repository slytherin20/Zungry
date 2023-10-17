import { useDispatch } from "react-redux";
import {
  addRestaurantToDB,
  addToDBCart,
  clearDB,
} from "../utils/firestore_cart";
import {
  addItem,
  cartRestaurant,
  emptyCart,
  removeRestaurant,
} from "../Store/CartSlice";
import { addItemToStorage } from "../utils/localStorageItemHelpers";
export function ReplaceItemsPopup({
  dish,
  from,
  to,
  toggleHandler,
  user,
  restaurant,
  customizationModal,
}) {
  let sizeVariations = dish?.variantsV2?.variantGroups
    ? dish?.variantsV2.variantGroups[0]?.variations
    : null;
  const dispatch = useDispatch();
  function replaceCartItems() {
    if (user) {
      clearDB(user);
      if (sizeVariations) {
        toggleHandler();
        customizationModal();
      } else {
        addToDBCart(dish, user);
        addRestaurantToDB(restaurant, user);
        toggleHandler();
      }
    } else {
      localStorage.clear();
      dispatch(emptyCart());
      dispatch(removeRestaurant());
      if (sizeVariations) {
        toggleHandler();
        customizationModal();
      } else {
        addItemToStorage(dish, restaurant);
        dispatch(addItem(dish));
        dispatch(cartRestaurant(restaurant));
        toggleHandler();
      }
    }
  }
  return (
    <article className="w-1/2 h-32 bg-white p-3">
      <h2 className="font-bold">Replace cart items?</h2>
      <p>
        Your cart contains dishes from {from}. Do you wish to discard the
        selection and add dishes from {to}?
      </p>

      <section className="w-3/4 flex justify-between m-auto">
        <button className="w-28 bg-red-500" onClick={toggleHandler}>
          No
        </button>
        <button className="w-28 bg-red-500" onClick={replaceCartItems}>
          Replace
        </button>
      </section>
    </article>
  );
}
