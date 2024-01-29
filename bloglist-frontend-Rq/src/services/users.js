import axios from "axios";
const baseUrl = "http://localhost:3001/api/users";

let token = null;

/* const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
}; */

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data;
};

export default { getAll };
