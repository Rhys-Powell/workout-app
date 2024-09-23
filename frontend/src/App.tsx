import { Outlet } from 'react-router-dom';
import './App.css';
import NavigationBar from './components/NavigationBar';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <AuthProvider>
    <UserProvider>
      <header>
        <NavigationBar />
      </header>
      <main>
        <Outlet />
      </main>
    </UserProvider>
    </AuthProvider>
  );
}

export default App;
