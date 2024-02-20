import { useQuery } from "@tanstack/react-query";
import userService from "../services/users";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

const UserBlogs = ({ users }) => {
  const navigate = useNavigate();
  const id = useParams().id;
  if (!users) {
    return null;
  } else {
    const user = users.find((n) => n.id === String(id));
    return (
      <div className="m-4 mt-20 font-serif">
        <h1 className="text-4xl">{user.name}</h1>
        <h2 className=" italic text-2xl text-gray-500">Added Blogs:</h2>
        <div className=" p-4 border-2 rounded-xl border-grey-500">
          <ul>
            {user.blogs.length === 0 ? (
              <p>No blogs added</p>
            ) : (
              user.blogs.map((blog) => (
                <li
                  onClick={() => {
                    navigate(`/blogs/${blog.id}`);
                  }}
                  key={blog.id}
                  className=" p-2 m-1 border rounded-lg hover:text-white font-serif font-medium bg-white hover:bg-gray-400 hover:m-3 hover:shadow-md cursor-pointer"
                >
                  {blog.title}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
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
