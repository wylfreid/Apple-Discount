import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auctionItems: []
};

const auctionSlice = createSlice({
  name: "auctions",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;

      const existingItem = state.auctionItems.find(
        (item) => item.id === newItem.id
      );

      if (!existingItem){
        state.auctionItems.push({
          id: newItem.id,
          productName: newItem.productName,
          shortDesc: newItem.shortDesc,
          description: newItem.description,
          imgUrl: newItem.imgUrl,
          startPrice: newItem.startPrice,
          currentPrice: newItem.currentPrice,
          step: newItem.step,
          endDate: newItem.endDate,
          category: newItem.category,
          active: newItem.active
        });
      }

     
    },
    updateCurrentPrice: (state, action) => {
      const auction = action.payload;
      const existingItem = state.auctionItems.find((item) => item.id === auction.id);

      if (existingItem) {
        for (let index = 0; index < state.auctionItems.length; index++) {
          if (existingItem.id === state.auctionItems[index].id) {
            state.auctionItems[index].currentPrice = auction.currentPrice
          }
          
        }
      }
     
    },
    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.auctionItems.find((item) => item.id === id);

      if (existingItem) {
        state.auctionItems = state.auctionItems.filter((item) => item.id !== id);
      }

     
    },

    deleteAllItems: (state, action) => {
        state.auctionItems.length = 0;
    },
  },
});

export const auctionsActions = auctionSlice.actions;

export default auctionSlice.reducer;
