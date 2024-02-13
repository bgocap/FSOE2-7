import { useState } from "react";

const Input = ({ id, type, value, changeHandler, placeholder }) => (
  <div>
    <input
      id={id}
      type={type || "text"}
      value={value}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      onChange={({ target }) => changeHandler(target.value)}
      placeholder={placeholder}
    />
  </div>
);

const LoginForm = ({ loginHandler }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const Login = (event) => {
    event.preventDefault();
    loginHandler({ username, password });
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <div className="m-5 max-w-sm">
        <h2
          className="text-3xl font-bold  text-gray-900 dark:text-white"
          id="loginTitle"
        >
          Login
        </h2>
      </div>

      <form className="max-w-sm mx-auto" onSubmit={Login}>
        <div className="mb-5">
          <label
            for="usernameInput"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Username
          </label>
          <Input
            id="usernameInput"
            name={"Username"}
            value={username}
            changeHandler={setUsername}
            placeholder="Aino Toivola"
          />
        </div>
        <div className="mb-5">
          <label
            for="passwordInput"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <Input
            id="passwordInput"
            type="password"
            name={"Password"}
            value={password}
            changeHandler={setPassword}
          />
        </div>
        <button
          id="loginButton"
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Log In
        </button>
      </form>
    </>
  );
};

export default LoginForm;
