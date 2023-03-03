

import { configureStore } from "@reduxjs/toolkit";
import auctionSlice from "./slices/auctionSlice";

import cartSlice from "./slices/cartSlice";
import favoriteSlice from "./slices/favoriteSlice";
import productSlice from "./slices/productSlice";
import userSlice from "./slices/userSlice";



const store = configureStore({
    reducer:{
        products: productSlice,
        cart: cartSlice,
        favorites: favoriteSlice,
        auctions:auctionSlice,
        users:userSlice,
    },
});

export default store;