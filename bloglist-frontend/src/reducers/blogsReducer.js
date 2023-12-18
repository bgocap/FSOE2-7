import { createSlice } from "@reduxjs/toolkit";
import blogs from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    appendBlogs(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
    //setBlog() {},
  },
});

export const { appendBlogs, setBlogs } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const allBlogs = await blogs.getAll();
    dispatch(setBlogs(allBlogs.sort((blgA, blgB) => blgB.likes - blgA.likes)));
  };
};

export const addBlog = (content, username) => {
  return async (dispatch) => {
    const newBlog = await blogs.createBlog(content);
    dispatch(appendBlogs({ ...newBlog, user: { name: username } }));
  };
};

export default blogSlice.reducer;
