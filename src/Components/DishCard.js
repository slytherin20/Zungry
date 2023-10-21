import {
  CLOUDANARY_API,
  NONVEG_LOGO,
  NOPHOTO,
  VEG_LOGO,
} from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  removeItem,
  removeRestaurant,
  updateItemCount,
  removeCustomizedItem,
  cartRestaurant,
} from "../Store/CartSlice";
import Modal from "./Modal";
import { useState } from "react";
import Customizations from "./Customizations";
import { useEffect } from "react";
import { countSize } from "../utils/helper";

import {
  addItemToStorage,
  removeCustomItemFromStorage,
  removeItemFromStorage,
} from "../utils/localStorageItemHelpers";
import {
  addRestaurantToDB,
  addToDBCart,
  deleteItemFromDB,
  deleteRestaurantFromDB,
  updateCartItemInDB,
} from "../utils/firestore_cart";
import { ReplaceItemsPopup } from "./ReplaceItemsPopup";

export default function DishCard({ dish, restaurantInfo, user }) {
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [count, setCount] = useState(0);
  const [replaceDishes, setReplaceDishes] = useState(false);
  let sizeVariations = dish?.variantsV2?.variantGroups
    ? dish?.variantsV2.variantGroups[0]?.variations
    : null;
  const dispatch = useDispatch();
  let storeCart = useSelector((store) => store.cart);
  let [cartItems, cartRestaurantInfo] = [
    storeCart.items || null,
    storeCart.restaurantDetails || null,
  ];
  useEffect(() => {
    if (cartItems.length) {
      let item = cartItems.filter((item) => item.id === dish.id)[0];
      if (item) {
        if (item.selectedOptions) {
          let sizeTypes = item.selectedOptions.size;
          let c = countSize(sizeTypes);
          setCount(c);
        } else {
          setCount(item.selectedQty);
        }
      } else setCount(0);
    } else setCount(0);
  }, [cartItems]);

  function addToCart(dish) {
    let item = cartItems.find((item) => item.id == dish.id);
    if (user) {
      if (sizeVariations) {
        if (
          cartRestaurantInfo &&
          cartRestaurantInfo.id &&
          cartRestaurantInfo.id !== restaurantInfo.id
        ) {
          //notify user via popup of different restaurant
          replaceDishesModal();
        } else toggleModal();
      } else {
        if (cartRestaurantInfo && cartRestaurantInfo.id !== restaurantInfo.id) {
          replaceDishesModal();
        } else {
          if (count === 0) {
            addToDBCart(dish, user);
            addRestaurantToDB(restaurantInfo, user);
          } else {
            updateCartItemInDB(user, item.id, item.selectedQty + 1);
          }
        }
      }
    } else {
      if (sizeVariations) {
        if (
          cartRestaurantInfo &&
          cartRestaurantInfo.id &&
          cartRestaurantInfo.id !== restaurantInfo.id
        ) {
          //Notify user via popup.
          replaceDishesModal();
        } else toggleModal();
      } else {
        //Add to localstorage without customization
        if (
          cartRestaurantInfo &&
          cartRestaurantInfo.id &&
          cartRestaurantInfo.id !== restaurantInfo.id
        ) {
          //Notify user via popup.
          replaceDishesModal();
        } else {
          addItemToStorage(dish, restaurantInfo);
          if (count === 0) {
            dispatch(addItem(dish));
            dispatch(cartRestaurant(restaurantInfo));
          } else {
            dispatch(updateItemCount(item.id));
          }
        }
      }
    }
  }

  function toggleModal() {
    setIsVisibleModal(!isVisibleModal);
  }
  function replaceDishesModal() {
    setReplaceDishes(!replaceDishes);
  }
  function removeFromCart(id) {
    //Localstorage added for no customization

    let item = cartItems.find((item) => item.id == id);
    if (!item) return;

    if (!item.selectedOptions?.size) {
      if (!user) {
        //No user, no customization
        removeItemFromStorage(id);
        dispatch(removeItem(id));
        if (cartItems.length === 1 && item.selectedQty === 1) {
          dispatch(removeRestaurant());
        }
      } else {
        if (item.selectedQty == 1) {
          deleteItemFromDB(user, id);
        } else {
          updateCartItemInDB(user, id, item.selectedQty - 1);
        }
        if (cartItems.length === 1 && item.selectedQty === 1) {
          deleteRestaurantFromDB(user);
        }
      }
    } else {
      let c = countSize(item.selectedOptions.size);
      if (!user) {
        //No user but customization
        if (c === 1) {
          dispatch(removeCustomizedItem(id));
          if (cartItems.length == 1) dispatch(removeRestaurant());
          removeCustomItemFromStorage(id);
        } else toggleModal();
      } else {
        if (c === 1) {
          deleteItemFromDB(user, id);
          if (cartItems.length == 1) deleteRestaurantFromDB(user);
        } else toggleModal();
      }
    }
  }
  if (!dish) return null;
  return (
    <div className="m-4 relative" data-testid="dish">
      <div className="w-full flex justify-between m-8" data-testid="dish-card">
        <div className="p-1 w-2/3" data-testid="dish-info">
          {dish.itemAttribute?.vegClassifier && (
            <div className="flex items-center text-sm">
              <img
                src={
                  dish.itemAttribute.vegClassifier == "VEG"
                    ? VEG_LOGO
                    : NONVEG_LOGO
                }
                alt="vegetarian food"
                width="15"
                height="15"
                className="w-4 h-4 mr-2"
                data-testid="food-pref-img"
              />
              <span data-testid="food-pref-name">
                {dish.itemAttribute.vegClassifier === "VEG" ? "VEG" : "NON-VEG"}
              </span>
            </div>
          )}
          <h3 className="text-xl" data-testid="dish-name">
            {dish.name}
          </h3>
          {dish.price && (
            <p className="text-sm" data-testid="dish-price">
              ₹{dish.price / 100}
            </p>
          )}

          <p data-testid="dish-desc">{dish.description}</p>
          {replaceDishes && (
            <Modal>
              <ReplaceItemsPopup
                from={cartRestaurantInfo.name}
                to={restaurantInfo.name}
                toggleHandler={replaceDishesModal}
                user={user}
                dish={dish}
                restaurant={restaurantInfo}
                customizationModal={toggleModal}
              />
            </Modal>
          )}
          {isVisibleModal && (
            <Modal>
              <Customizations
                toggleModal={toggleModal}
                isVisibleModal={isVisibleModal}
                sizeVariations={sizeVariations}
                dish={dish}
                restaurantInfo={restaurantInfo}
                count={count}
                cartItems={cartItems}
                user={user}
              />
            </Modal>
          )}
        </div>
        {dish.imageId ? (
          <img
            src={CLOUDANARY_API + dish.imageId}
            alt="food"
            width="150"
            height="150"
            className="w-28 h-28"
            data-testid="dish-img"
          />
        ) : (
          <img
            src={NOPHOTO}
            alt="picture not available"
            width="150"
            height="150"
            className="w-36 h-36"
            data-testid="dish-img"
          />
        )}
        {count === 0 ? (
          <button
            className="absolute bg-red-500 text-white w-20 h-8 rounded-md bottom-0 right-5 text-sm
          "
            onClick={() => addToCart(dish)}
            data-testid="dish-btn"
          >
            Add
          </button>
        ) : (
          <div className="absolute bg-red-500 text-white w-20 h-8 rounded-md bottom-0 right-5 text-sm flex justify-evenly items-center">
            <button onClick={() => addToCart(dish)} data-testid="inc-btn">
              +
            </button>
            <span data-testid="dish-count">{count}</span>
            <button
              onClick={() => removeFromCart(dish.id)}
              data-testid="delete-btn"
            >
              -
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
