import { useState } from "react";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import loginService from "../services/login";
import { setUserInfo } from "../reducers/currenUserReducer";

const Input = ({ id, type, name, value, changeHandler }) => (
  <div>
    {name}
    <input
      id={id}
      type={type || "text"}
      value={value}
      name={name}
      onChange={({ target }) => changeHandler(target.value)}
    />
  </div>
);

const LoginForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const Login = async (event) => {
    event.preventDefault();
    const userData = { username, password };
    console.log(userData);
    try {
      const user = await loginService.login(userData);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      dispatch(setUserInfo(userData));
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(
        setNotification(
          { message: `Wrong password or username`, isError: true },
          5
        )
      );
    }
  };

  return (
    <div>
      <h2 id="loginTitle">Log In</h2>
      <form onSubmit={Login}>
        <Input
          id="usernameInput"
          name={"Username"}
          value={username}
          changeHandler={setUsername}
        />
        <Input
          id="passwordInput"
          type="password"
          name={"Password"}
          value={password}
          changeHandler={setPassword}
        />
        <button id="loginButton" type="submit">
          login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
