import { Link } from "react-router-dom";

const NavBar = ({ user, logoutHandler }) => {
  const NavBarStyle = {
    marginTop: 0,
    background: "#f0f8ff",
    padding: 5,
  };
  /*   return (
      <div style={NavBarStyle}>
        <Link to="/blogs">blogs</Link>
        <Link to="/users"> users</Link>
        
        <button onClick={() => logoutHandler()}>Log out</button>
      </div>
    ); */

  return (
    <>
      <nav className="absolute top-0 left-100 right-0 text-black">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div
            className="p-3 border rounded-full border-gray-300 items-center justify-between w-full md:flex md:w-auto "
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:border-gray-700">
              <li>
                <Link to="/blogs">
                  <p
                    href="#"
                    className="block py-2 px-3 text-black md:p-0 hover:text-gray-300"
                    aria-current="page"
                  >
                    Blogs
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/users">
                  <p
                    href="#"
                    className="block py-2 px-3 text-black md:p-0 hover:text-gray-300"
                  >
                    Users
                  </p>
                </Link>
              </li>
              <li className="font-light italic text-gray-500">{`  ${user.name} logged in`}</li>
              <li>
                <a
                  onClick={() => {
                    logoutHandler();
                  }}
                  className="block py-2 px-3 text-black md:p-0 hover:text-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 17l5-5-5-5M19.8 12H9M10 3H4v18h6" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
