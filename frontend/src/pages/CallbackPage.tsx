import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export const CallbackPage = () => {
  const { isAuthenticated, isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/profile');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  return <div>Loading...</div>;
};
