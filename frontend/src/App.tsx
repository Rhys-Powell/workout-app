import { Outlet, useLocation } from 'react-router-dom';
import './App.scoped.css';
import NavigationBar from './components/NavigationBar';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  const location = useLocation();
  
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
