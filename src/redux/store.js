

import { configureStore } from "@reduxjs/toolkit";

import cartSlice from "./slices/cartSlice";
import favoriteSlice from "./slices/favoriteSlice";


const store = configureStore({
    reducer:{
        cart: cartSlice,
        favorites: favoriteSlice,
    },
});

export default store;