import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { setNotificationValue } from "./components/NotificationContext";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import NewBlogForm from "./components/NewBlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";

const App = () => {
  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });
  const blogs = result.data;
  const NotificationDispatch = setNotificationValue();
  const newBlogFormRef = useRef();
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();
  const newBlogMutation = useMutation({
    mutationFn: blogService.createBlog,
    onSuccess: (newBlog) => {
      const blogs2 = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs2.concat(newBlog));
      NotificationDispatch({
        type: "SET",
        content: {
          text: `${newBlog.title} by ${newBlog.author} has been submited`,
          isError: false,
        },
      });
    },
    onError: () => {
      NotificationDispatch({
        type: "SET",
        content: { text: "Something went wrong", isError: true },
      });
    },
  });

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
      const returnedBlog = newBlogMutation.mutate(newBlog);
      console.log(returnedBlog);
    } catch (exception) {}
    setTimeout(() => {
      NotificationDispatch({ type: "RESET" });
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
      NotificationDispatch({
        type: "SET",
        content: {
          text: `You voted for ${returnedBlog.title} by ${returnedBlog.author}`,
          isError: false,
        },
      });
    } catch (exception) {
      NotificationDispatch({
        type: "SET",
        content: {
          text: "Something went wrong",
          isError: true,
        },
      });
    }
    setTimeout(() => {
      NotificationDispatch({ type: "RESET" });
    }, 5000);
  };

  const removeBlog = async (idTodelete) => {
    try {
      blogService.deleteBlog(idTodelete);
      const updatedBlogs = blogs.filter((blg) => blg.id !== idTodelete);
      setBlogs(updatedBlogs);
      NotificationDispatch({
        type: "SET",
        content: { text: "Blog deleted", isError: false },
      });
    } catch (exception) {
      NotificationDispatch({
        type: "SET",
        content: {
          text: "Something went wrong",
          isError: true,
        },
      });
    }
    setTimeout(() => {
      NotificationDispatch({ type: "RESET" });
    }, 5000);
  };

  const handleLogin = async (userData) => {
    try {
      const user = await loginService.login(userData);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setUser(user);
      NotificationDispatch({ type: "RESET" });
    } catch (exception) {
      NotificationDispatch({
        type: "SET",
        content: {
          text: "Wrong username or password",
          isError: true,
        },
      });
      setTimeout(() => {
        NotificationDispatch({ type: "RESET" });
      }, 5000);
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    NotificationDispatch({ type: "RESET" });
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
          <div className="allBlogs">
            {blogs &&
              blogs
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
