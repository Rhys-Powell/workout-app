import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from './Tooltip';
import './SignupForm.scoped.css';
import tooltip from '../../metadata/tooltips.json';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSignup = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    try {
      const response = await fetch('https://' + import.meta.env.VITE_AUTH0_DOMAIN +
        '/dbconnections/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
          email,
          password,
          connection: 'Username-Password-Authentication',
          user_metadata: { name }, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/profile');
        console.log('Signup successful:', data);
      } else {
        setErrorMessage(data.description || 'Something went wrong during signup.');
      }
    } catch (error) {
      setErrorMessage('Error signing up: ' + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <div className="input-wrapper">
        <label className="has-tooltip" >
          Password:
          <input  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <Tooltip text={tooltip.PASSWORD_TOOLTIP} />
      </div>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <button type="submit">Sign Up</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
};

export default SignupForm;
