import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Exercises from './pages/Exercises';
import Routines from './pages/Routines';
import Routine from './pages/Routine';
import { Exercise } from './components/Exercise';
import NotFound from './pages/NotFound';
import { CallbackPage } from './pages/CallbackPage';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import SignupForm from './components/SignupForm';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path: 'signup',
          element: <SignupForm />,
        },
        {
          path: 'profile',
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: 'users/:userId/exercises',
          element: (
            <ProtectedRoute>
              <Exercises />
            </ProtectedRoute>
          ),
        },
        {
          path: 'users/:userId/exercises/:exerciseId',
          element: (
            <ProtectedRoute>
              <Exercise />
            </ProtectedRoute>
          ),
        },
        {
          path: 'users/:userId/routines',
          element: (
            <ProtectedRoute>
              <Routines />
            </ProtectedRoute>
          ),
        },
        {
          path: 'users/:userId/routines/:routineId',
          element: (
            <ProtectedRoute>
              <Routine />
            </ProtectedRoute>
          ),
        },
        {
          path: '/callback',
          element: (
              <CallbackPage />
          )
        },
        {
          path: '*',
          element: <NotFound />,
        },
        
      ],
    },
  ], 
);

export default router;
