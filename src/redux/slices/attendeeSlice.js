import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  attendees: [],
};

const attendeeSlice = createSlice({
  name: "attendees",
  initialState,
  reducers: {
    addAttendee: (state, action) => {
      const newUser = action.payload;
      const existingItem = state.attendees.find((item) => item.uid === newUser.uid);

      if (!existingItem) {
        state.attendees.push({
          uid: newUser.uid,
          displayName: newUser.displayName,
          email: newUser.email,
          photoURL: newUser.photoURL,
          createdAt: newUser.createdAt
        });
      }
    },
    deleteAttendee: (state, action) => {
      const uid = action.payload;
      const existingItem = state.attendees.find((item) => item.uid === uid);

      if (existingItem) {
        state.attendees = state.attendees.filter((item) => item.uid !== uid);
      }
    },

    deleteAllAttendees: (state, action) => {
      state.attendees.length = 0;
    },
  },
});

export const attendeesActions = attendeeSlice.actions;

export default attendeeSlice.reducer;
