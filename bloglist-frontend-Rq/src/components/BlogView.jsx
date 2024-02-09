import { useState } from "react";
import { useParams } from "react-router-dom";
import BlogService from "../services/blogs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setNotificationValue } from "./NotificationContext";

const BlogView = ({ blogs, loggedUser, likeHandler, deleteHandler }) => {
  const [commentary, setCommentary] = useState("");
  const blogId = useParams().id;
  const NotificationDispatch = setNotificationValue();
  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: BlogService.addComment,
    onSuccess: (returnedBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((blg) => (blg.id === returnedBlog.id ? returnedBlog : blg))
      );
      NotificationDispatch({
        type: "SET",
        content: {
          text: `Your commentary has been submited`,
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

  const createComment = (event) => {
    event.preventDefault();
    const newComment = { blogId: blogId, content: commentary };
    addCommentMutation.mutate(newComment);
    setCommentary("");
    setTimeout(() => {
      NotificationDispatch({ type: "RESET" });
    }, 5000);
  };

  if (!blogs) {
    return null;
  } else {
    const blog = blogs.find((n) => n.id === String(blogId));
    const addedByUser = loggedUser.id === blog.user.id ? true : false;

    return (
      <>
        <h1>{blog.title}</h1>
        <h2>by: {blog.author}</h2>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
        <div className="blogUserName">{`Added by: ${blog.user.name}`}</div>
        <br></br>
        {blog.likes}
        <button onClick={() => likeHandler({ ...blog, likes: blog.likes + 1 })}>
          {"Like button"}
        </button>
        <br></br>
        {addedByUser && (
          <button onClick={() => deleteHandler(blogId)}>delete</button>
        )}
        <h2>Comments:</h2>
        <form onSubmit={createComment}>
          <input
            type="text"
            value={commentary}
            name="Comment"
            onChange={({ target }) => setCommentary(target.value)}
          />
          <button>Add comment</button>
        </form>
        <div>
          {blog.comments.length === 0 || !blog.comments ? (
            <div>No comments yet</div>
          ) : (
            <ul>
              {blog.comments.map((cmnt) => (
                <li key={cmnt}>{cmnt}</li>
              ))}
            </ul>
          )}
        </div>
      </>
    );
  }
};

export default BlogView;
