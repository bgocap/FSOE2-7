import { useState, useEffect, useRef } from "react";
import { setNotificationValue } from "./components/NotificationContext";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import NewBlogForm from "./components/NewBlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  const [notificationMessage, setNotificationMessage] = useState({
    text: null,
    isError: null,
  });
  console.log(setNotificationValue());
  const dispatch = setNotificationValue();

  const newBlogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
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
      const returnedBlog = await blogService.createBlog(newBlog);
      setBlogs(blogs.concat({ ...returnedBlog, user: { name: user.name } }));
      dispatch({
        type: "SET",
        content: {
          text: `${returnedBlog.title} by ${returnedBlog.author} has been submited`,
          isError: false,
        },
      });
    } catch (exception) {
      dispatch({
        type: "SET",
        content: { text: "Something went wrong", isError: true },
      });
    }
    setTimeout(() => {
      dispatch({ type: "RESET" });
    }, 5000);
  };

  const addLikes = async (likedBlogId) => {
    const fullBlog = blogs.find((blg) => blg.id === likedBlogId);
    const likedBlog = {
      user: fullBlog.user.id,
      likes: fullBlog.likes + 1,
      author: fullBlog.author,
      title: fullBlog.title,
      url: fullBlog.url,
    };
    try {
      const returnedBlog = await blogService.addLikes(likedBlog, likedBlogId);
      const updatedBlogs = blogs.map((blg) =>
        blg.id === likedBlogId ? { ...blg, likes: likedBlog.likes } : blg
      );
      setBlogs(updatedBlogs);
    } catch (exception) {
      setNotificationMessage({
        text: "Something went wrong",
        isError: "error",
      });
    }
    setTimeout(() => {
      setNotificationMessage({ text: null, isError: null });
    }, 5000);
  };

  const removeBlog = async (idTodelete) => {
    try {
      blogService.deleteBlog(idTodelete);
      const updatedBlogs = blogs.filter((blg) => blg.id !== idTodelete);
      setBlogs(updatedBlogs);
      setNotificationMessage({ text: "Blog deleted", isError: false });
    } catch (exception) {
      setNotificationMessage({ text: "Something went wrong", isError: true });
    }
    setTimeout(() => {
      setNotificationMessage({ text: null, isError: null });
    }, 5000);
  };

  const handleLogin = async (userData) => {
    try {
      const user = await loginService.login(userData);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setUser(user);
    } catch (exception) {
      setNotificationMessage({
        text: "Wrong username or password",
        isError: true,
      });
      setTimeout(() => {
        setNotificationMessage({ text: null, isError: null });
      }, 5000);
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
      <Notification
        message={notificationMessage.text}
        isError={notificationMessage.isError}
      />
      {!user && <LoginForm loginHandler={handleLogin} />}
      {user && (
        <div>
          <p>
            {user.name} logged in{" "}
            <button onClick={() => handleLogout()}>logout</button>
          </p>
          {newBlogForm()}
          <div className="allBlogs">
            {blogs
              .sort((blgA, blgB) => blgB.likes - blgA.likes)
              .map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  handleLikes={addLikes}
                  currentUser={user}
                  deleteHandler={removeBlog}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
