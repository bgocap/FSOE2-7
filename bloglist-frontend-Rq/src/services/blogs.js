import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const createBlog = async (newBlog) => {
  const config = { headers: { authorization: token } }
  const request = await axios.post(baseUrl, newBlog, config)
  return request.data
}

const addLikes = async (likedBlog, likedBlogId) => {
  const request = await axios.put(`${baseUrl}/${likedBlogId}`, likedBlog)
  return request.data
}

const deleteBlog = async (idToDelete) => {
  const config = { headers: { authorization: token } }
  const request = await axios.delete(`${baseUrl}/${idToDelete}`, config)
  return request.data
}

export default { getAll, setToken, createBlog, addLikes, deleteBlog }
