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
import { addBlog, initializeBlogs } from "./reducers/blogsReducer";

const App = () => {
  /* const [blogs, setBlogs] = useState([]); */
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

  const blogs = useSelector((state) => state.blogs);
  console.log(blogs);

  const addNewBlog = async (newBlog) => {
    try {
      newBlogFormRef.current.toggleVisibility();
      //const returnedBlog = await blogService.createBlog(newBlog);
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
      dispatch(
        setNotification(
          {
            message: `you have voted for '${likedBlog.title}'`,
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

  const removeBlog = async (idTodelete) => {
    try {
      blogService.deleteBlog(idTodelete);
      const updatedBlogs = blogs.filter((blg) => blg.id !== idTodelete);
      setBlogs(updatedBlogs);
      setNotification(
        {
          message: "Blog deleted",
          isError: false,
        },
        5
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

  /*   {blogs
    .map((blog) => (
      <Blog
        key={blog.id}
        blog={blog}
        handleLikes={addLikes}
        currentUser={user}
        deleteHandler={removeBlog}
      />
    ))} */
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
          <div className="allBlogs"></div>
        </div>
      )}
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLikes={addLikes}
          currentUser={user}
          deleteHandler={removeBlog}
        />
      ))}
    </div>
  );
};

export default App;
