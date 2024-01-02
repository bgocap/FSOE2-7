import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./src/reducers/notificationReducer";
import blogsReducer from "./src/reducers/blogsReducer";
import currentUserReducer from "./src/reducers/currenUserReducer";

const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    notificationMessage: notificationReducer,
    userInfo: currentUserReducer,
  },
});

export default store;
