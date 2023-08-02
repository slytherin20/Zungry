import {
  CLOUDANARY_API,
  NONVEG_LOGO,
  NOPHOTO,
  VEG_LOGO,
} from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  cartRestaurant,
  removeItem,
  removeRestaurant,
  updateItemCount,
  removeCustomizedItem,
} from "../Store/CartSlice";
import Modal from "./Modal";
import { useState } from "react";
import Customizations from "./Customizations";
import { useEffect } from "react";
import { countSize } from "../utils/helper";

export default function DishCard({ dish, restaurantInfo }) {
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [count, setCount] = useState(0);
  let sizeVariations = dish?.variantsV2?.variantGroups
    ? dish?.variantsV2.variantGroups[0]?.variations
    : null;
  const dispatch = useDispatch();
  const cartItems = useSelector((store) => store.cart.items);

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
      }
    } else setCount(0);
  }, [cartItems]);

  function addToCart(item) {
    if (sizeVariations) {
      toggleModal();
    } else {
      if (count === 0) {
        dispatch(addItem(item));
        dispatch(cartRestaurant(restaurantInfo));
      } else {
        dispatch(updateItemCount(item.id));
      }
    }
  }
  function toggleModal() {
    setIsVisibleModal(!isVisibleModal);
  }

  function removeFromCart(id) {
    let item = cartItems.find((item) => item.id == id);
    if (!item) return;

    if (!item.selectedOptions?.size) {
      dispatch(removeItem(id));
      if (cartItems.length === 1 && item.selectedQty === 1) {
        dispatch(removeRestaurant());
      }
    } else {
      let c = countSize(item.selectedOptions.size);
      if (c === 1) {
        dispatch(removeCustomizedItem(id));
        dispatch(removeRestaurant());
      } else toggleModal();
    }
  }
  if (!dish) return null;
  return (
    <div className="m-4 relative" data-testid="dish">
      <div className="w-full flex justify-between m-10" data-testid="dish-card">
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
            className="w-36 h-30"
            data-testid="dish-img"
          />
        ) : (
          <img
            src={NOPHOTO}
            alt="picture not available"
            width="150"
            height="150"
            className="w-36 h-30"
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
