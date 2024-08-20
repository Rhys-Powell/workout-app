import { useState } from 'react';
import { useAuth } from '../context/AuthHooks';

export default function Login() {
  const [input, setInput] = useState({ email: '', password: '' });
  const context = useAuth();
  const login = context?.login;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (input.email !== '' && input.password !== '') {
      if (login) {
        await login(input.email, input.password);
      } else {
        console.log(Error);
      }
    } else alert('Please provide both email and password');
  }

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" onChange={handleInput} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" onChange={handleInput} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
