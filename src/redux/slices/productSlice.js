import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.products.find(
        (item) => item.id === newItem.id
      );

      if (!existingItem) {
        state.products.push({
          id: newItem.id,
          productName: newItem.productName,
          shortDesc: newItem.shortDesc,
          description: newItem.description,
          category: newItem.category,
          price: newItem.price,
          imgUrl: newItem.imgUrl,
          trending: newItem.trending,
        });
      }
    },
    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.products.find((item) => item.id === id);

      if (existingItem) {
        state.products = state.products.filter((item) => item.id !== id);
      }
    },

    deleteAllItems: (state, action) => {
      state.products.length = 0;
    },
  },
});

export const productActions = productSlice.actions;

export default productSlice.reducer;
