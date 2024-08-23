import { Link } from 'react-router-dom';
import './NavigationBar.css';
import { useAuth } from '../context/AuthHooks';

export default function NavigationBar() {
  const authContext = useAuth();
  const userId = authContext?.user?.id;
  const logout = authContext?.logout;
  const isLoggedIn = !!authContext?.token;

  async function handleClick() {
    if (logout) {
      await logout();
    }
  }

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
      {isLoggedIn && (
        <div className="navbar-item">
          <button onClick={handleClick}>Log out</button>
        </div>
      )}
    </nav>
  );
}
