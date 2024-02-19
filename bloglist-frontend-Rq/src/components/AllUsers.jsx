import { useQuery } from "@tanstack/react-query";
import userService from "../services/users";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const id = useParams().id;
  return (
    <div className="m-3 mt-10 font-serif">
      <h1 className="text-7xl  ">Users</h1>
      <div className="mt-6 flex justify-center">
        <table className="w-3/4 m-4 p-3 ">
          <thead className=" text-2xl italic">
            <tr>
              <th className="text-start p-3">Name</th>
              <th>Blogs created</th>
            </tr>
          </thead>
          <tbody className="border rounded-xl border-gray-300">
            {users &&
              users.map((user) => (
                <tr
                  onClick={() => {
                    navigate(`${user.id}`);
                  }}
                  key={user.id}
                  className=" hover:text-white font-serif font-medium bg-white hover:bg-gray-400 hover:m-4 hover:shadow-md cursor-pointer"
                >
                  <td className="p-3 ">{user.name}</td>
                  <td className="text-center">{user.blogs.length}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
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
