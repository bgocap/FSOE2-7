import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const BlogView = ({ blogs, loggedUser, likeHandler, deleteHandler }) => {
  const blogId = useParams().id;

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
      </>
    );
  }
};

export default BlogView;
