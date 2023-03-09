

import { configureStore } from "@reduxjs/toolkit";
import attendeeSlice from "./slices/attendeeSlice";
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
        attendees: attendeeSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});

export default store;