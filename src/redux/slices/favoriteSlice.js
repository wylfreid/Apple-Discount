import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoritesItems: [],
  totalQuantity: 0,
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.favoritesItems.find(
        (item) => item.id === newItem.id
      );

      state.totalQuantity++;

      if (!existingItem) {
        state.favoritesItems.push({
          id: newItem.id,
          productName: newItem.productName,
          imgUrl: newItem.imgUrl,
          price: newItem.price,
          category: newItem.category
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice =
          Number(existingItem.totalPrice) + Number(newItem.price);
      }

     
    },
    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.favoritesItems.find((item) => item.id === id);

      if (existingItem) {
        state.favoritesItems = state.favoritesItems.filter((item) => item.id !== id);
        state.totalQuantity--;
      }

     
    },

    deleteAllItems: (state, action) => {

        state.favoritesItems.length = 0;
        state.totalQuantity = 0;
    },
  },
});

export const favoritesActions = favoriteSlice.actions;

export default favoriteSlice.reducer;
