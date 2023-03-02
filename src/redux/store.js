

import { configureStore } from "@reduxjs/toolkit";
import auctionSlice from "./slices/auctionSlice";

import cartSlice from "./slices/cartSlice";
import favoriteSlice from "./slices/favoriteSlice";
import productSlice from "./slices/productSlice";


const store = configureStore({
    reducer:{
        products: productSlice,
        cart: cartSlice,
        favorites: favoriteSlice,
        auctions:auctionSlice,
    },
});

export default store;