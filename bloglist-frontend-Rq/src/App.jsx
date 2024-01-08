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
  const [user, setUser] = useState(null);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);
  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });
  const blogs = result.data;
  const NotificationDispatch = setNotificationValue();
  const newBlogFormRef = useRef();

  const queryClient = useQueryClient();
  const newBlogMutation = useMutation({
    mutationFn: blogService.createBlog,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.concat({ ...newBlog, user: { name: user.name, id: user.id } })
      );
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
  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
      NotificationDispatch({
        type: "SET",
        content: { text: "Blog deleted", isError: false },
      });
    },
    onError: () => {
      NotificationDispatch({
        type: "SET",
        content: {
          text: "Something went wrong",
          isError: true,
        },
      });
    },
  });

  const likeBlogMutation = useMutation({
    mutationFn: blogService.addLikes,
    onSuccess: (returedBlog) => {
      queryClient.invalidateQueries(["blogs"]);
      NotificationDispatch({
        type: "SET",
        content: {
          text: `You have voted for ${returedBlog.title} by ${returedBlog.author}`,
          isError: false,
        },
      });
    },
    onError: () => {
      NotificationDispatch({
        type: "SET",
        content: {
          text: "Something went wrong",
          isError: true,
        },
      });
    },
  });

  const addNewBlog = (newBlog) => {
    newBlogFormRef.current.toggleVisibility();
    newBlogMutation.mutate(newBlog);
    setTimeout(() => {
      NotificationDispatch({ type: "RESET" });
    }, 5000);
  };

  const addLikes = async (likedBlog) => {
    likeBlogMutation.mutate({ ...likedBlog, user: likedBlog.user.id });
    setTimeout(() => {
      NotificationDispatch({ type: "RESET" });
    }, 5000);
  };

  const removeBlog = (idTodelete) => {
    deleteBlogMutation.mutate(idTodelete);
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
