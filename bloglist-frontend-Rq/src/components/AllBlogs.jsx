import blogService from "../services/blogs";
import Blog from "./Blog";
import NewBlogForm from "./NewBlogForm";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import Togglable from "./Togglable";
import { setNotificationValue } from "./NotificationContext";

const allBlogs = ({ userInfo }) => {
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
    deleteBlogMutation.mutate(idTodelete);
    setTimeout(() => {
      NotificationDispatch({ type: "RESET" });
    }, 5000);
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
    <>
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
                currentUser={userInfo}
                deleteHandler={removeBlog}
              />
            ))}
      </div>
    </>
  );
};

export default allBlogs;
