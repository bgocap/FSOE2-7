import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./src/reducers/notificationReducer";
import blogsReducer from "./src/reducers/blogsReducer";

const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    notificationMessage: notificationReducer,
  },
});

export default store;
