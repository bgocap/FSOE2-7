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
    setBlog(state, action) {
      return state.map((blogs) =>
        blogs.id !== action.payload.id ? blogs : action.payload
      );
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
  },
});

export const { appendBlogs, setBlogs, setBlog, removeBlog } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const allBlogs = await blogs.getAll();
    dispatch(setBlogs(allBlogs));
  };
};

export const addBlog = (content, username) => {
  return async (dispatch) => {
    const newBlog = await blogs.createBlog(content);
    dispatch(appendBlogs({ ...newBlog, user: { name: username } }));
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    const response = await blogs.deleteBlog(id);
    dispatch(removeBlog(id));
    console.log(response);
  };
};

export const likeBlog = (content, id) => {
  return async (dispatch) => {
    const likedBlog = await blogs.addLikes(
      { ...content, user: content.user.id },
      id
    );
    dispatch(setBlog(content));
  };
};

export default blogSlice.reducer;
