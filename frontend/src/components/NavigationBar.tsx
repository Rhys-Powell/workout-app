import { Link } from 'react-router-dom';
import './NavigationBar.css';
import { useAuth } from '../context/AuthHooks';

export default function NavigationBar() {
  const context = useAuth();
  const logout = context?.logout;
  const isLoggedIn = !!context?.token;

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
        <Link to="/exercises">Exercises</Link>
      </div>
      {isLoggedIn && (
        <div className="navbar-item">
          <button onClick={handleClick}>Log out</button>
        </div>
      )}
    </nav>
  );
}
