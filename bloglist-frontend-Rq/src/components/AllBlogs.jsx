import blogService from "../services/blogs";
import BlogView from "./BlogView";
import NewBlogForm from "./NewBlogForm";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import Togglable from "./Togglable";
import { setNotificationValue } from "./NotificationContext";
import { useNavigate, Route, Routes, Link } from "react-router-dom";

const allBlogs = ({ userInfo }) => {
  const navigate = useNavigate();
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

  const Bloglist = ({ blogs }) => {
    const blogstyle = {
      marginBottom: 3,
      borderColor: "Black",
      borderStyle: "solid",
      borderRadius: 10,
      padding: 5,
    };

    return (
      <>
        {newBlogForm()}
        <div className="allBlogs">
          {blogs &&
            blogs
              .sort((blgA, blgB) => blgB.likes - blgA.likes)
              .map((blog) => (
                <div
                  key={blog.id}
                  className="m-3 rounded border-gray-900 bg-white hover:bg-slate-400 hover:m-4 hover:shadow-md "
                >
                  <Link to={`/blogs/${blog.id}`}>
                    <h3 className="color-white">{`${blog.title} `}</h3>
                  </Link>
                  <p>{`by ${blog.author} `}</p>
                </div>
              ))}
        </div>
      </>
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
