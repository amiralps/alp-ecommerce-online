"use client"
import {configureStore} from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice.js";
import loginReducer from "../features/login/loginSlice.js";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    login: loginReducer
  },
});

export default store;
