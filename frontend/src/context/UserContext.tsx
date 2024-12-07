import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { User } from '../types/User';
import { extractSubstring } from '../helpers/extractSubstring';
import { useAuth0 } from '@auth0/auth0-react';
import DataService from '../DataService';

export interface UserContextType {
  currentUser: User | null;
  updateCurrentUser (user: User | null) : void;
  isUserFetched: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [ currentUser, setCurrentUser ] = useState<User | null>(null);
  const [ isUserFetched, setIsUserFetched] = useState(false);
  const { getAccessTokenSilently, user: auth0user } = useAuth0();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedGetAccessTokenSilently = useCallback(getAccessTokenSilently, []);
  const dataService = useMemo(() => DataService(), []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = await memoizedGetAccessTokenSilently(); 
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
        setIsUserFetched(true);
      }
    }
    fetchCurrentUser();
  }, [auth0user, dataService, memoizedGetAccessTokenSilently]);
  
  const updateCurrentUser = (newUser: User | null) => {
    setCurrentUser(newUser);
  }

  return (
    <UserContext.Provider value={{ currentUser, updateCurrentUser, isUserFetched }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserProvider, UserContext}
