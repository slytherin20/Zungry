import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./CartSlice";
import accountSlice from "./acountSlice";
const store = configureStore({
  reducer: {
    cart: cartSlice,
    account: accountSlice,
  },
});

export default store;
