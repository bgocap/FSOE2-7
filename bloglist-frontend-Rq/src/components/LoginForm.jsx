import { useState } from "react";

const Input = ({ id, type, value, changeHandler, placeholder }) => (
  <div>
    <input
      id={id}
      type={type || "text"}
      value={value}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
    <div className="max-w-400">
      <h2
        className=" ml-5 mb-5 text-3xl italic font-bold font-serif"
        id="loginTitle"
      >
        Login
      </h2>
      <div className="p-5 border rounded-lg border-gray-300">
        <form className="max-w-sm mx-auto" onSubmit={Login}>
          <div className="mb-5">
            <label
              target="usernameInput"
              className="block mb-2 text-sm font-medium text-gray-900"
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
              target="passwordInput"
              className="block mb-2 text-sm font-medium text-gray-900"
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
            className=" font-serif border round-lg  text-black hover:text-white hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
