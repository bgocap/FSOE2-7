import blogService from "../services/blogs";
import BlogView from "./BlogView";
import NewBlogForm from "./NewBlogForm";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import Togglable from "./Togglable";
import { setNotificationValue } from "./NotificationContext";
import { useNavigate, Route, Routes, Link } from "react-router-dom";
import { flushSync } from "react-dom";

const allBlogs = ({ userInfo }) => {
  document.startViewTransition();
  const queryClient = useQueryClient();
  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });
  const blogs = result.data;
  const newBlogFormRef = useRef();
  const NotificationDispatch = setNotificationValue();

  const newBlogMutation = useMutation({
    mutationFn: blogService.createBlog,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.concat({
          ...newBlog,
          user: { name: userInfo.name, id: userInfo.id },
        })
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
    navigate("/blogs");
    deleteBlogMutation.mutate(idTodelete);
    setTimeout(() => {
      NotificationDispatch({ type: "RESET" });
    }, 5000);
  };

  const newBlogForm = () => {
    return (
      <Togglable
        buttonLabelOpen="Create a new blog"
        buttonLabelClose="Cancel"
        ref={newBlogFormRef}
      >
        <NewBlogForm submitBlog={addNewBlog} />
      </Togglable>
    );
  };

  const BlogLink = ({ to, children }) => {
    const navigate = useNavigate();
    return (
      <a
        href={to}
        onClick={(ev) => {
          ev.preventDefault();
          console.log("Onclick");
          document.startViewTransition(() => {
            flushSync(() => {
              navigate(to);
            });
          });
        }}
      >
        {children}
      </a>
    );
  };

  const Bloglist = ({ blogs }) => {
    const blogstyle = {
      marginBottom: 3,
      borderColor: "Black",
      borderStyle: "solid",
      borderRadius: 10,
      padding: 5,
    };
    document.startViewTransition();
    return (
      <div className="m-3 mt-10">
        <h1 className="text-7xl font-serif">Blogs</h1>
        {newBlogForm()}
        <div className="allBlogs">
          {blogs &&
            blogs
              .sort((blgA, blgB) => blgB.likes - blgA.likes)
              .map((blog) => (
                <BlogLink to={`/blogs/${blog.id}`}>
                  <div
                    key={blog.id}
                    className="mb-3 p-2 border rounded border-gray-300 hover:text-white font-serif font-medium bg-white hover:bg-gray-400 hover:m-4 hover:shadow-md "
                  >
                    <h3 className="text-xl">{`${blog.title} `}</h3>

                    <h4 className="italic">{`by ${blog.author} `}</h4>
                  </div>
                </BlogLink>
              ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Bloglist blogs={blogs} />} />
        <Route
          path="/:id"
          element={
            <BlogView
              blogs={blogs}
              likeHandler={addLikes}
              loggedUser={userInfo}
              deleteHandler={removeBlog}
            />
          }
        />
      </Routes>
    </>
  );
};

export default allBlogs;
