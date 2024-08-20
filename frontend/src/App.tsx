import { Outlet } from 'react-router-dom';
import './App.css';
import NavigationBar from './components/NavigationBar';
import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <>
      <AuthProvider>
        <header>
          <NavigationBar />
        </header>
        <main>
          <Outlet />
        </main>
      </AuthProvider>
    </>
  );
}

export default App;
