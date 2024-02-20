import { useState } from "react";

const NewBlogForm = ({ submitBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });
  const createBlog = (event) => {
    event.preventDefault();
    submitBlog(newBlog);
    setNewBlog({ title: "", author: "", url: "" });
  };

  return (
    <div className=" mb-6 p-6 w-2/5 border rounded-lg border-gray-300 text-slate-700">
      <h2 className=" mb-6 text-black text-2xl italic font-semibold font-serif">
        Create New
      </h2>
      <form onSubmit={createBlog}>
        <div className="mb-3">
          <label
            scope="Title"
            className="block mb-2 text-sm font-medium text-black"
          >
            Title
          </label>
          <input
            type="text"
            value={newBlog.title}
            name="Title"
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, title: target.value })
            }
            id="Title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <div className="mb-3">
          <label
            scope="small-input"
            className="block mb-2 text-sm font-medium text-black"
          >
            Author
          </label>
          <input
            type="text"
            value={newBlog.author}
            name="Author"
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, author: target.value })
            }
            id="small-input"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <div className="mb-3">
          <label
            scope="url"
            className="block mb-2 text-sm font-medium text-black"
          >
            URL
          </label>
          <input
            type="text"
            id="url"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={newBlog.url}
            name="URL"
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, url: target.value })
            }
          />
        </div>

        <button
          type="submit"
          className=" font-serif border round-lg  text-black hover:text-white hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default NewBlogForm;
