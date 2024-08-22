import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from '../src/pages/Home';
import { Exercise } from '../src/components/Exercise';
import Login from '../src/pages/Login';
import PrivateRoute from './context/RouteGuard';
import Routines from './pages/Routines';
import Routine from './pages/Routine';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
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
      {
        path: 'users/:userId/routines',
        element: (
          <PrivateRoute>
            <Routines />
          </PrivateRoute>
        ),
      },
      {
        path: 'users/:userId/routines/:routineId',
        element: (
          <PrivateRoute>
            <Routine />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
