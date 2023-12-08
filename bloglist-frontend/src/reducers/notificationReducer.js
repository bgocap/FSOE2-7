import { createSlice } from "@reduxjs/toolkit";

const initialState = { message: null, isError: false };

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setContent(state, action) {
      return action.payload;
    },
    resetContent(state, action) {
      return initialState;
    },
  },
});

export const { setContent, resetContent } = notificationSlice.actions;

export const setNotification = (content, timeoutSeconds) => {
  return (dispatch) => {
    dispatch(setContent(content));
    setTimeout(() => {
      dispatch(resetContent());
    }, timeoutSeconds * 1000);
  };
};

export default notificationSlice.reducer;
