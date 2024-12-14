import { Outlet, useLocation } from 'react-router-dom';
import './App.scoped.css';
import NavigationBar from './components/NavigationBar';
import { WorkoutProvider } from './context/WorkoutContext';

function App() {
  const location = useLocation();
  
  return (
    <WorkoutProvider>
      {location.pathname !== '/signup' && location.pathname !== '/callback' && (
        <header>
          <NavigationBar />
        </header>
      )}
      <main>
        <Outlet />
      </main>
    </WorkoutProvider>
  );
}

export default App;
