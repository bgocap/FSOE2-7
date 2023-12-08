import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./src/reducers/notificationReducer";

const store = configureStore({
  reducer: {
    notificationMessage: notificationReducer,
  },
});

export default store;
