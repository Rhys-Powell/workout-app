import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from '../src/pages/Home';
import { Exercise } from '../src/components/Exercise';
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
        path: '/exercises',
        element: <Exercise />,
      },
    ],
  },
]);

export default router;
