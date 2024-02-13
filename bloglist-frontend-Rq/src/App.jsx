import { useEffect } from "react";
import { setNotificationValue } from "./components/NotificationContext";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import {
  setLoggedUserInfo,
  useLoggedUserInfo,
} from "./components/LoggedUserContext";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AllUsers from "./components/AllUsers";
import AllBlogs from "./components/AllBlogs";

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
      {`  ${user.name} logged in`}
      <button onClick={() => logoutHandler()}>Log out</button>
    </div>
  ); */

  return (
    <>
      <nav class="bg-gradient-to-r from-indigo-600 to-pink-500">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/blogs">
            <h1 className="text-4xl font-bold text-white">Blogs</h1>
          </Link>
          <div
            class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:border-gray-700">
              <li>
                <a
                  href="#"
                  class="block py-2 px-3 text-white rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Users
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

const App = () => {
  const loggedUserInfoDispatch = setLoggedUserInfo();
  const userInfo = useLoggedUserInfo();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      loggedUserInfoDispatch({ type: "SET", content: user });
      blogService.setToken(user.token);
    }
  }, []);

  const NotificationDispatch = setNotificationValue();

  const handleLogin = async (userData) => {
    try {
      const user = await loginService.login(userData);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      loggedUserInfoDispatch({ type: "SET", content: user });
      NotificationDispatch({ type: "RESET" });
    } catch (exception) {
      NotificationDispatch({
        type: "SET",
        content: {
          text: "Wrong username or password",
          isError: true,
        },
      });
      setTimeout(() => {
        NotificationDispatch({ type: "RESET" });
      }, 5000);
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    NotificationDispatch({ type: "RESET" });
    loggedUserInfoDispatch({ type: "RESET" });
  };

  return (
    <Router>
      {!userInfo && (
        <div className="w-full h-screen p-4 size-100  bg-slate-800">
          <div className=" flex flex-col items-center">
            <h1 className="p-9 font-serif text-white text-6xl">Blogs</h1>
            <Notification />
            <LoginForm loginHandler={handleLogin} />
          </div>
        </div>
      )}
      {userInfo && (
        <>
          <NavBar user={userInfo} logoutHandler={handleLogout} />
          <Notification />
          <Routes>
            <Route path="/blogs/*" element={<AllBlogs userInfo={userInfo} />} />
            <Route path="/users/*" element={<AllUsers />} />
          </Routes>
        </>
      )}
    </Router>
  );
};

export default App;
