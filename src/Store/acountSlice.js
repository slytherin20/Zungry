import { createSlice } from "@reduxjs/toolkit";
import { saveProfileDetails } from "../Reducers/accountReducers";
const accountSlice = createSlice({
  name: "account",
  initialState: {
    profileDetails: {},
  },
  reducers: {
    saveDetails: saveProfileDetails,
  },
});

export default accountSlice.reducer;

export const { saveDetails } = accountSlice.actions;
