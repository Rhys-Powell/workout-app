import { Link } from 'react-router-dom';
import './NavigationBar.css';
import LoginButton from './LoginButton';
import SignupButton from './SignupButton';
import LogoutButton from './LogoutButton';
import { useCurrentUser } from '../context/UseCurrentUserHook';
import { useAuth0 } from '@auth0/auth0-react';

export default function NavigationBar() {
  const { isAuthenticated } = useAuth0();
  const { currentUser } = useCurrentUser();
  const userId = currentUser?.id;

  return (
    <nav className="navigation-bar">
      <div className="navbar-item">
        <Link to="/">Home</Link>
      </div>
      <div className="navbar-item">
        <Link to={`/users/${userId}/exercises`}>Exercises</Link>
      </div>
      <div className="navbar-item">
        <Link to={`/users/${userId}/routines`}>Routines</Link>
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
