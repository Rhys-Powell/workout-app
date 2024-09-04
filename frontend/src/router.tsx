import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Exercises from './pages/Exercises';
import Login from './pages/Login';
import PrivateRoute from './context/RouteGuard';
import Routines from './pages/Routines';
import Routine from './pages/Routine';
import { Exercise } from './components/Exercise';
import NotFound from './pages/NotFound';

const router = createBrowserRouter(
  [
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
          path: 'users/:userId/exercises',
          element: (
            <PrivateRoute>
              <Exercises />
            </PrivateRoute>
          ),
        },
        {
          path: 'users/:userId/exercises/:exerciseId',
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
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
  ], 
  {
    basename: process.env.NODE_ENV === 'production' ? '/workout-app/' : '',
  }
);

export default router;
