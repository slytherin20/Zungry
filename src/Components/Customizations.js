import { useState } from "react";
import { useDispatch } from "react-redux";
import { CLOSE_BTN } from "../utils/constants";
import {
  addItem,
  cartRestaurant,
  removeCustomizedItem,
  removeRestaurant,
  updateCustomizedItemCount,
} from "../Store/CartSlice";
import { countSize } from "../utils/helper";
import {
  addItemToStorage,
  removeCustomItemFromStorage,
  updateCustomItemInStorage,
} from "../utils/localStorageItemHelpers";
import {
  addRestaurantToDB,
  addToDBCart,
  deleteItemFromDB,
  deleteRestaurantFromDB,
  updateCustomizedItemInDB,
} from "../utils/firestore_cart";

export default function Customizations({
  toggleModal,
  isVisibleModal,
  sizeVariations,
  dish,
  restaurantInfo,
  count,
  cartItems,
  user,
}) {
  const dispatch = useDispatch();

  let selectedItem = cartItems.filter((item) => item.id === dish.id)[0];
  const [selectedOptions, setSelectedOption] = useState(
    selectedItem?.selectedOptions?.size || {}
  );

  function updateCount() {
    if (!selectedItem) {
      addToCart(dish);
    } else if (!selectedItem.selectedOptions) {
      selectedItem.selectedOptions = {
        size: selectedOptions,
      };
      addToCart(selectedItem);
    } else if (!selectedItem.selectedOptions.size) {
      selectedItem.selectedOptions.size = selectedOptions;
      addToCart(selectedItem);
    } else if (!countSize(selectedOptions)) {
      removeFromCart(dish.id);
    } else {
      addToCart(selectedItem);
    }
    toggleModal();
  }
  function addToCart(selectedItem) {
    if (!selectedItem.selectedOptions) {
      selectedItem.selectedOptions = {
        size: selectedOptions,
      };
    }
    if (!selectedItem.selectedOptions.size) {
      selectedItem.selectedOptions.size = selectedOptions;
    }
    if (count === 0) {
      if (!user) {
        dispatch(addItem(selectedItem));
        dispatch(cartRestaurant(restaurantInfo));
        addItemToStorage(selectedItem, restaurantInfo);
      } else {
        addToDBCart(selectedItem, user);
        addRestaurantToDB(restaurantInfo, user);
      }
    } else {
      if (!user) {
        dispatch(
          updateCustomizedItemCount({
            id: selectedItem.id,
            selectedOption: selectedOptions,
          })
        );
        updateCustomItemInStorage(selectedItem.id, selectedOptions);
      } else {
        updateCustomizedItemInDB(user, selectedItem.id, selectedOptions);
      }
    }
  }
  function removeFromCart(id) {
    if (!user) {
      dispatch(removeCustomizedItem(id));
      if (cartItems.length == 1) dispatch(removeRestaurant()); //Change: restaurant should be deleted only when no other items are in cart
      removeCustomItemFromStorage(id);
    } else {
      deleteItemFromDB(user, id);
      if (cartItems.length == 1) deleteRestaurantFromDB(user);
    }
  }
  function selectMenuOption(e) {
    if (e.target.name === "increase" || e.target.name === "price") {
      setSelectedOption({
        ...selectedOptions,
        [e.target.className]: selectedOptions[e.target.className] + 1 || 1,
      });
    } else if (e.target.name === "decrease") {
      let val =
        selectedOptions[e.target.className] - 1 > 0
          ? selectedOptions[e.target.className] - 1
          : 0;
      setSelectedOption({
        ...selectedOptions,
        [e.target.className]: val,
      });
    }
  }
  return (
    <div
      className="w-3/5 h-96 bg-white rounded-md p-4"
      data-testid="customization-menu"
    >
      <p className="h-8">
        <img
          src={CLOSE_BTN}
          alt="close popup"
          width="20"
          height="20"
          onClick={toggleModal}
          className=" float-right cursor-pointer"
        />
      </p>
      <p className="h-6 pb-9">Size Options:</p>
      <div>
        {isVisibleModal &&
          sizeVariations.map((size) => {
            if (count === 0)
              return (
                <div
                  key={size.id}
                  className="flex flex-row justify-between w-3/4"
                  onChange={(e) => selectMenuOption(e)}
                >
                  {size.name}
                  <label htmlFor={size.id} className="w-1/3">
                    <input
                      type="radio"
                      value={size.price}
                      id={size.id}
                      name="price"
                      className={size.name}
                      data-testid="custom-option"
                    />
                    ₹{size.price}
                  </label>
                </div>
              );
            else {
              return (
                <div
                  key={size.id}
                  className="flex flex-row justify-between w-3/4"
                >
                  <div>
                    <p> {size.name}</p>
                    <p> ₹{size.price}</p>
                  </div>
                  <div className=" bg-white  w-20 h-8 rounded-md text-sm flex justify-evenly items-center border border-green-500">
                    <p className="add border border-r-green-500 w-1/3 h-full p-1 cursor-pointer text-center">
                      <input
                        type="button"
                        value="+"
                        id={size.id}
                        name="increase"
                        className={size.name}
                        onClick={(e) => selectMenuOption(e)}
                        data-testid="cust-inc-count"
                      />
                    </p>
                    <p className="border border-r-green-500 w-1/3 h-full p-1 text-center">
                      {" "}
                      {selectedOptions[size.name] || 0}
                    </p>
                    <p className="minus w-1/3 h-full p-1 cursor-pointer text-center">
                      <input
                        type="button"
                        value="-"
                        id={size.id}
                        name="decrease"
                        className={size.name}
                        onClick={(e) => selectMenuOption(e)}
                        data-testid="cust-decrease-count"
                      />
                    </p>
                  </div>
                </div>
              );
            }
          })}
      </div>
      <button
        onClick={updateCount}
        className="bg-green-600 text-white font-bold p-2 rounded-md text-sm float-right"
        data-testid="continue-btn"
      >
        Continue
      </button>
    </div>
  );
}
