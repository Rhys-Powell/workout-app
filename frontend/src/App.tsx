import { Outlet, useLocation } from 'react-router-dom';
import './App.scoped.css';
import NavigationBar from './components/NavigationBar';
import { UserProvider } from './context/UserContext';
import { WorkoutProvider } from './context/WorkoutContext';

function App() {
  const location = useLocation();
  
  return (
    <WorkoutProvider>
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
    </WorkoutProvider>
  );
}

export default App;
