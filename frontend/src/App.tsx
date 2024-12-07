import { Outlet, useLocation } from 'react-router-dom';
import './App.scoped.css';
import NavigationBar from './components/NavigationBar';
import { UserProvider } from './context/UserContext';

function App() {
  const location = useLocation();
  
  return (
    <UserProvider>
      {location.pathname !== '/signup' && (
        <header>
          <NavigationBar />
        </header>
      )}
      <main>
        <Outlet />
      </main>
    </UserProvider>
  );
}

export default App;
