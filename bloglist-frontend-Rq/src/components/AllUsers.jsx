import { useQuery } from "@tanstack/react-query";
import userService from "../services/users";

const AllUsers = () => {
  const result = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
  });
  const users = result.data;

  return (
    <>
      <h1>Users</h1>
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
                <td>{user.name}</td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};
export default AllUsers;
