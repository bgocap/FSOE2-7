import { useState } from 'react'

const NewBlogForm = ({ submitBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const createBlog = (event) => {
    event.preventDefault()
    submitBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <h2>
        <em>Create New</em>
      </h2>
      <form onSubmit={createBlog}>
        <div>
          Title:
          <input
            type='text'
            value={newBlog.title}
            name='Title'
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, title: target.value })
            }
          ></input>
        </div>
        <div>
          Author:
          <input
            type='text'
            value={newBlog.author}
            name='Author'
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, author: target.value })
            }
          ></input>
        </div>
        <div>
          URL:
          <input
            type='text'
            value={newBlog.url}
            name='URL'
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, url: target.value })
            }
          ></input>
          <button type='submit'>save</button>
        </div>
      </form>
    </div>
  )
}

export default NewBlogForm
