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
import NavBar from "./components/NavBar";

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
        <div className="w-full h-screen p-30 size-100 flex flex-row items-center align-top">
          <div className="ml-10 w-6/12 flex justify-center">
            <h1 className=" font-serif text-black text-6xl">Blogs</h1>
          </div>
          <div className="w-6/12 flex  justify-center">
            <LoginForm loginHandler={handleLogin} />
          </div>

          <Notification />
        </div>
      )}
      {userInfo && (
        <>
          <NavBar user={userInfo} logoutHandler={handleLogout} />
          <Notification />
          <Routes>
            <Route path="/users/*" element={<AllUsers />} />
            <Route path="/blogs/*" element={<AllBlogs userInfo={userInfo} />} />
          </Routes>
        </>
      )}
    </Router>
  );
};

export default App;
