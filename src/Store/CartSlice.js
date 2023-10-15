import { createSlice } from "@reduxjs/toolkit";
import {
  addAllItems,
  addFoodItem,
  clearCart,
  clearSavedRestaurant,
  removeCustomizedFoodItem,
  removeFoodItem,
  savedRestaurantCart,
  updateCustomizedFoodItemCount,
  updateFoodItemCount,
} from "../Reducers/cartReducers";
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    restaurantDetails: {},
  },
  reducers: {
    addItem: addFoodItem,
    removeItem: removeFoodItem,
    emptyCart: clearCart,
    cartRestaurant: savedRestaurantCart,
    removeRestaurant: clearSavedRestaurant,
    updateItemCount: updateFoodItemCount,
    updateCustomizedItemCount: updateCustomizedFoodItemCount,
    removeCustomizedItem: removeCustomizedFoodItem,
    addAll: addAllItems,
  },
});

export default cartSlice.reducer;
export const {
  addItem,
  removeItem,
  emptyCart,
  cartRestaurant,
  removeRestaurant,
  updateItemCount,
  updateCustomizedItemCount,
  removeCustomizedItem,
  addAll,
} = cartSlice.actions;
