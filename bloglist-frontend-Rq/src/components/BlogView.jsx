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
        <div className="m-4 mt-32 p-3 flex-row border rounded-lg border-gray-300">
          <div className=" font-serif">
            <h1 className="text-4xl">{blog.title}</h1>
            <h2 className="text-italic">by: {blog.author}</h2>
          </div>
          <a href={blog.url} target="_blank" rel="noopener noreferrer">
            <div className="flex">
              <p className="text-black font-semibold">{blog.url}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            </div>
          </a>
          <div className="blogUserName italic">{`Added by: ${blog.user.name}`}</div>
          <div className="flex">
            <p className="text-black font-semibold border rounded-lg border-black px-1">
              {blog.likes} likes
            </p>
            <button
              onClick={() => likeHandler({ ...blog, likes: blog.likes + 1 })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 w-5 h-5 stroke-black stroke-2 hover:stroke-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
            </button>
          </div>

          {addedByUser && (
            <button
              onClick={() => deleteHandler(blogId)}
              className=" mt-2 font-serif border round-lg  text-black hover:text-white hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              delete
            </button>
          )}
        </div>
        <div className="m-4 p-3 font-serif">
          <h2 className="text-2xl">Comments:</h2>
          <form onSubmit={createComment}>
            <div className="flex">
              <input
                type="text"
                value={commentary}
                name="Comment"
                onChange={({ target }) => setCommentary(target.value)}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              <span class="inline-flex items-center ">
                <button>
                  <svg
                    className="w-7 h-7 stroke-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </span>
            </div>
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
        </div>
      </>
    );
  }
};

export default BlogView;
