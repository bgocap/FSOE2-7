import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { setNotificationValue } from "./components/NotificationContext";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import userService from "./services/users";
import {
  setLoggedUserInfo,
  useLoggedUserInfo,
} from "./components/LoggedUserContext";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AllUsers from "./components/AllUsers";
import AllBlogs from "./components/AllBlogs";

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
      <div>
        <h1 style={{ fontSize: 50 }}>
          <em>Blogs</em>
        </h1>
        <Notification />
        {!userInfo && <LoginForm loginHandler={handleLogin} />}
        {userInfo && (
          <div>
            <p>
              {userInfo.name} logged in{" "}
              <button onClick={() => handleLogout()}>logout</button>
            </p>
            <Routes>
              <Route
                path="/blogs/*"
                element={<AllBlogs userInfo={userInfo} />}
              />
              <Route path="/users/*" element={<AllUsers />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
