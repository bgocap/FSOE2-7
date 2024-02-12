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
  return (
    <div style={NavBarStyle}>
      <Link to="/blogs">blogs</Link>
      <Link to="/users"> users</Link>
      {`  ${user.name} logged in`}
      <button onClick={() => logoutHandler()}>Log out</button>
    </div>
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
          <h1 className="box-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-4xl font-bold text-white">
            Blogs
          </h1>
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
