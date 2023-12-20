import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import NewBlogForm from "./components/NewBlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "./reducers/notificationReducer";
import { addBlog, initializeBlogs, likeBlog } from "./reducers/blogsReducer";
import BlogList from "./components/BlogList";

const App = () => {
  const [user, setUser] = useState(null);
  const newBlogFormRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addNewBlog = async (newBlog) => {
    try {
      newBlogFormRef.current.toggleVisibility();
      const content = { ...newBlog, user: { name: user.name } };
      dispatch(addBlog(content, user.name));
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

  const handleLogin = async (userData) => {
    try {
      const user = await loginService.login(userData);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setUser(user);
    } catch (exception) {
      dispatch(
        setNotification(
          {
            message: `Wrong password or username`,
            isError: true,
          },
          5
        )
      );
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser("");
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
      {!user && <LoginForm loginHandler={handleLogin} />}
      {user && (
        <div>
          <p>
            {user.name} logged in{" "}
            <button onClick={() => handleLogout()}>logout</button>
          </p>
          {newBlogForm()}
          <BlogList userId={user.id} />
        </div>
      )}
    </div>
  );
};

export default App;
