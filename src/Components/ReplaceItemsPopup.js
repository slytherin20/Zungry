import { useDispatch } from "react-redux";
import {
  addRestaurantToDB,
  addToDBCart,
  clearDB,
} from "../utils/firestore_utils";
import {
  addItem,
  cartRestaurant,
  emptyCart,
  removeRestaurant,
} from "../Store/CartSlice";
import { addItemToStorage } from "../utils/localStorageItemHelpers";

export function ReplaceItemsPopup({
  dishes,
  from,
  to,
  toggleHandler,
  user,
  restaurant,
  customizationModal,
}) {
  let sizeVariations;
  if (!dishes?.length) {
    sizeVariations = dishes?.variantsV2?.variantGroups
      ? dishes?.variantsV2.variantGroups[0]?.variations
      : null;
  }
  const dispatch = useDispatch();
  async function replaceCartItems() {
    if (user) {
      await clearDB(user);
      if (dishes?.length) {
        addRestaurantToDB(restaurant, user);
        dishes.map((dish) => addToDBCart(dish, user));
        toggleHandler();
      } else {
        if (sizeVariations) {
          toggleHandler();
          customizationModal();
        } else {
          addToDBCart(dishes, user);
          addRestaurantToDB(restaurant, user);
          toggleHandler();
        }
      }
    } else {
      localStorage.clear();
      dispatch(emptyCart());
      dispatch(removeRestaurant());
      if (sizeVariations) {
        toggleHandler();
        customizationModal();
      } else {
        addItemToStorage(dishes, restaurant);
        dispatch(addItem(dishes));
        dispatch(cartRestaurant(restaurant));
        toggleHandler();
      }
    }
  }
  return (
    <article className="w-1/2  bg-white p-4 rounded-md shadow-md">
      <h2 className="font-bold">Replace cart items?</h2>
      <p className="text-sm">
        Your cart contains dishes from {from}. Do you wish to discard the
        selection and add dishes from {to}?
      </p>

      <section className="w-full flex justify-evenly m-auto">
        <button
          className="w-20 border border-red-700 rounded-md text-red-700 hover:bg-slate-200"
          onClick={toggleHandler}
        >
          No
        </button>
        <button
          className="w-20 bg-red-700 text-white rounded-md hover:bg-red-500"
          onClick={replaceCartItems}
        >
          Replace
        </button>
      </section>
    </article>
  );
}
