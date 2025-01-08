import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import DataService from '../DataService';
import { User } from '../types/User';
import { extractSubstring } from '../helpers/extractSubstring';
import errors from '../../metadata/errors.json';
import Errors from '../types/errors';
import FetchError from '../types/FetchError';

const typedErrors: Errors = errors;

export const CallbackPage = () => {
  const { isAuthenticated, isLoading, error, getAccessTokenSilently, user: auth0user, logout } = useAuth0();
  const navigate = useNavigate();
  const memoizedFetchCurrentUser = useCallback(fetchCurrentUser, [fetchCurrentUser]);
  
  const dataService = useMemo(() => DataService(), []);
  const [ isUserFetched, setIsUserFetched] = useState(false);
  const [ auth0userFetched, setAuth0UserFetched] = useState(false);
  const [ isErrorOnFetch, setIsErrorOnFetch] = useState(false);
  const [ errorMessage, setErrorMessage] = useState('');
  const [ displayError, setDisplayError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (error || isErrorOnFetch) {
      if (error) {
        setErrorMessage(error.message);
      }
      setDisplayError(true);
    }
  }, [error, isErrorOnFetch]);

  useEffect(() => {
    if (displayError) {
      timeoutRef.current = setTimeout(() => {
        logout();
      }, 5000);
    }
  }, [displayError, logout]);

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
      catch (fetchError: FetchError | unknown) {
        if (fetchError instanceof FetchError && fetchError.status === 404) {
          setIsErrorOnFetch(true);
          setErrorMessage(typedErrors.USER_NOT_FOUND);
        }
        console.error(error);
      }
    }

    function setCurrentUser(fetchedUser: User) {
      localStorage.setItem('currentUserId', JSON.stringify(fetchedUser?.id));
      localStorage.setItem('currentUserName', JSON.stringify(fetchedUser?.name));
      setIsUserFetched(true);
    }
  }

  return (
    <div>
      {displayError ? <div>Oops... {errorMessage}</div> 
      : <p>Loading...</p>}
    </div>
  )
};
