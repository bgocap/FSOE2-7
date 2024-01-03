import { useEffect, useRef } from "react";
import blogService from "./services/blogs";
import Notification from "./components/Notification";
import NewBlogForm from "./components/NewBlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "./reducers/notificationReducer";
import { addBlog, initializeBlogs, likeBlog } from "./reducers/blogsReducer";
import BlogList from "./components/BlogList";
import { deleteUserInfo, setUserInfo } from "./reducers/currenUserReducer";

const App = () => {
  const newBlogFormRef = useRef();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userInfo);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUserInfo(user));
      blogService.setToken(user.token);
    }
  }, []);

  const addNewBlog = async (newBlog) => {
    try {
      newBlogFormRef.current.toggleVisibility();
      const content = { ...newBlog, user: { name: currentUser.name } };
      dispatch(addBlog(content, currentUser.name));
      dispatch(
        setNotification(
          {
            message: `${newBlog.title} by ${newBlog.author} has been submited`,
            isError: false,
          },
          5
        )
      );
    } catch (exception) {
      dispatch(
        setNotification(
          {
            message: `Something went wrong`,
            isError: true,
          },
          5
        )
      );
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    dispatch(deleteUserInfo());
  };

  const newBlogForm = () => (
    <Togglable
      buttonLabelOpen="Create a new blog"
      buttonLabelClose="Cancel"
      ref={newBlogFormRef}
    >
      <NewBlogForm submitBlog={addNewBlog} />
    </Togglable>
  );

  return (
    <div>
      <h1 style={{ fontSize: 50 }}>
        <em>Blogs</em>
      </h1>
      <Notification />
      {!currentUser && <LoginForm />}
      {currentUser && (
        <div>
          <p>
            {currentUser.name} logged in{" "}
            <button onClick={() => handleLogout()}>logout</button>
          </p>
          {newBlogForm()}
          <BlogList userId={currentUser.id} />
        </div>
      )}
    </div>
  );
};

export default App;
