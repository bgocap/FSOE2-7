import Togglable from './Togglable'
import { useState } from 'react'

const Blog = ({ blog, handleLikes, deleteHandler, currentUser }) => {
  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }
  const buttonValue = visible ? 'hide' : 'show'
  const addedByUser = currentUser.id === blog.user.id ? true : false

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogstyle = {
    marginBottom: 3,
    borderColor: 'Black',
    borderStyle: 'solid',
    borderRadius: 10,
    padding: 5,
  }

  return (
    <div style={blogstyle} className='blog'>
        {`${blog.title} by ${blog.author} `}
        <button onClick={() => toggleVisibility()} className='showButton'>{buttonValue}</button>
      <div style={showWhenVisible} className='blogDetails'>
        <div className='blogUrl'>{blog.url}</div>
        <div className='blogLikes'>{`Likes : ${blog.likes} `}
          <button onClick={() => handleLikes(blog.id)}>like</button>
        </div>
        <div className='blogUserName'>
          {`User: ${blog.user.name}`}
        </div>
        {addedByUser && (
          <button onClick={() => deleteHandler(blog.id)}>delete</button>
        )}
      </div>
    </div>
  )
}

export default Blog
