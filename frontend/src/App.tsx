import { Outlet } from 'react-router-dom';
import './App.css';
import NavigationBar from './components/NavigationBar';

function App() {
  return (
    <>
      <header>
        <NavigationBar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
