import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import DataService from '../DataService';
import { User } from '../types/User';
import { extractSubstring } from '../helpers/extractSubstring';

export const CallbackPage = () => {
  const { isAuthenticated, isLoading, error, getAccessTokenSilently, user: auth0user } = useAuth0();
  const navigate = useNavigate();
  const memoizedFetchCurrentUser = useCallback(fetchCurrentUser, [fetchCurrentUser]);
  
  const dataService = useMemo(() => DataService(), []);
  const [ isUserFetched, setIsUserFetched] = useState(false);
  const [ auth0userFetched, setAuth0UserFetched] = useState(false);

  useEffect(() => {
    if(auth0user) {
      setAuth0UserFetched(true);
    }
  }, [auth0user]);
  
  useEffect(() => {
    if (!isLoading && isAuthenticated && auth0userFetched) {
      memoizedFetchCurrentUser();
    }
  }, [isLoading, isAuthenticated, memoizedFetchCurrentUser, auth0userFetched]);

  useEffect(() => {
    if (isUserFetched) {
      navigate('/profile');
    }
  }, [isUserFetched, navigate]);

  async function fetchCurrentUser() {
    const token = await getAccessTokenSilently(); 
    if (auth0user && token) {
      const auth0id = extractSubstring(auth0user.sub!, '|');
      try {
        const response = await dataService.getData(token, 'users/auth/' + auth0id);
        if (response) {
          const fetchedUser: User = response;
          setCurrentUser(fetchedUser);
        }
      }
      catch (error) {
        console.error(error);
      }
    }

    function setCurrentUser(fetchedUser: User) {
      localStorage.setItem('currentUserId', JSON.stringify(fetchedUser?.id));
      localStorage.setItem('currentUserName', JSON.stringify(fetchedUser?.name));
      setIsUserFetched(true);
    }
  }

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  return <div>Loading...</div>;
};
