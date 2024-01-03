import { useState } from 'react'

const Input = ({ id,type, name, value, changeHandler }) => (
  <div>
    {name}
    <input
      id={id}
      type={type || 'text'}
      value={value}
      name={name}
      onChange={({ target }) => changeHandler(target.value)}
    />
  </div>
)

const LoginForm = ({ loginHandler }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const Login = (event) => {
    event.preventDefault()
    loginHandler({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2 id='loginTitle'>Log In</h2>
      <form onSubmit={Login}>
        <Input id='usernameInput' name={'Username'} value={username} changeHandler={setUsername} />
        <Input
          id='passwordInput'
          type='password'
          name={'Password'}
          value={password}
          changeHandler={setPassword}
        />
        <button id='loginButton' type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
