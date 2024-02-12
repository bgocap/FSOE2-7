import { useQuery } from "@tanstack/react-query";
import userService from "../services/users";
import { Routes, Route, Link, useParams } from "react-router-dom";

const UserBlogs = ({ users }) => {
  const id = useParams().id;
  if (!users) {
    return null;
  } else {
    const user = users.find((n) => n.id === String(id));
    return (
      <>
        <h1>{user.name}</h1>
        <h2>Added Blogs</h2>
        <ul>
          {user.blogs.length === 0 ? (
            <p>No blogs added</p>
          ) : (
            user.blogs.map((blog) => (
              <li key={blog.id}>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </li>
            ))
          )}
        </ul>
      </>
    );
  }
};

const UsersChart = ({ users }) => {
  const id = useParams().id;
  return (
    <>
      <h1 className="text-2xl font-bold underline">Users</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

const AllUsers = () => {
  const result = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
  });
  const users = result.data;

  return (
    <>
      <Routes>
        <Route path="/" element={<UsersChart users={users} />} />
        <Route path="/:id" element={<UserBlogs users={users} />} />
      </Routes>
    </>
  );
};

export default AllUsers;
