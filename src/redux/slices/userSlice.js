import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const newUser = action.payload;
      const existingItem = state.users.find((item) => item.uid === newUser.uid);

      if (!existingItem) {
        state.users.push({
          admin: newUser.admin,
          participant: newUser.participant,
          uid: newUser.uid,
          displayName: newUser.displayName,
          email: newUser.email,
          photoURL: newUser.photoURL,
        });
      }
    },
    deleteUser: (state, action) => {
      const uid = action.payload;
      const existingItem = state.users.find((item) => item.uid === uid);

      if (existingItem) {
        state.users = state.users.filter((item) => item.uid !== uid);
      }
    },

    deleteAllUsers: (state, action) => {
      state.users.length = 0;
    },
  },
});

export const usersActions = userSlice.actions;

export default userSlice.reducer;
