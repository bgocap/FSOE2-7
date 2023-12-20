import { useDispatch, useSelector } from "react-redux";
import { likeBlog, deleteBlog } from "../reducers/blogsReducer";
import { setNotification } from "../reducers/notificationReducer";
import Blog from "./Blog";

const BlogList = ({ userId }) => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  console.log(blogs);

  const addLikes = async (likedBlogId) => {
    const fullBlog = blogs.find((blg) => blg.id === likedBlogId);
    const likedBlog = { ...fullBlog, likes: fullBlog.likes + 1 };
    try {
      console.log(likedBlog);
      dispatch(likeBlog(likedBlog, likedBlogId));
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

  const removeBlog = (id) => {
    dispatch(deleteBlog(id));
  };

  return (
    <>
      {[...blogs]
        .sort((blgA, blgB) => blgB.likes - blgA.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLikes={addLikes}
            currentUserId={userId}
            deleteHandler={removeBlog}
          />
        ))}
    </>
  );
};

export default BlogList;
