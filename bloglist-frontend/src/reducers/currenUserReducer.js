import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userInfo",
  initialState: null,
  reducers: {
    appendInfo(state, action) {
      return action.payload;
    },
  },
});

export const { appendInfo } = userSlice.actions;

export const setUserInfo = (user) => {
  return async (dispatch) => {
    dispatch(appendInfo(user));
  };
};

export const deleteUserInfo = () => {
  return async (dispatch) => {
    dispatch(appendInfo(null));
  };
};

export default userSlice.reducer;
