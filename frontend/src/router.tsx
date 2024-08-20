import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from '../src/pages/Home';
import { Exercise } from '../src/components/Exercise';
import Login from '../src/pages/Login';
import PrivateRoute from './context/RouteGuard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/exercises',
        element: (
          <PrivateRoute>
            <Exercise />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
