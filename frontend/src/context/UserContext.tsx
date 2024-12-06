import React, { createContext, useEffect, useState } from 'react';
import { User } from '../types/User';
import { extractSubstring } from '../helpers/extractSubstring';
import { useAuth } from './UseAuthHook';

const API_BASE_URL = import.meta.env.VITE_API_URL;
export interface UserContextType {
  currentUser: User | null;
  updateCurrentUser (user: User | null) : void;
  isUserFetched: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [ currentUser, setCurrentUser ] = useState<User | null>(null);
  const { token, user: auth0user } = useAuth();
  const [ isUserFetched, setIsUserFetched] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (auth0user && token) {
        const auth0id = extractSubstring(auth0user.sub!, '|');
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/auth/${auth0id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          })
          const fetchedUser = await response.json();
          if (fetchedUser) {
              setCurrentUser(fetchedUser);
          }
          setIsUserFetched(true);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    }
    fetchCurrentUser();
  }, [auth0user, token]);
  
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
