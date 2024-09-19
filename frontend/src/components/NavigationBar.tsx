import { Link } from 'react-router-dom';
import './NavigationBar.css';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import SignupButton from './SignupButton';
import LogoutButton from './LogoutButton';

export default function NavigationBar() {
  const { user, isAuthenticated } = useAuth0();

  return (
    <nav className="navigation-bar">
      <div className="navbar-item">
        <Link to="/">Home</Link>
      </div>
      <div className="navbar-item">
        <Link to={`/users/${user?.userId}/exercises`}>Exercises</Link>
      </div>
      <div className="navbar-item">
        <Link to={`/users/${user?.userId}/routines`}>Routines</Link>
      </div>
      {!isAuthenticated && (
        <div className="navbar-item">
          <LoginButton />
        </div>
      )}
      {!isAuthenticated && (
        <div className="navbar-item">
          <SignupButton />
        </div>
      )}
      {isAuthenticated && (
        <div className="navbar-item">
          <LogoutButton />
        </div>
      )}
    </nav>
  );
}
