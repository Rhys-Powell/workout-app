import React, { createContext, useState, useEffect } from 'react';
import { User } from '../types/User';

export interface UserContextType {
  currentUser: User | null;
  updateCurrentUser (user: User | null) : void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [ currentUser, setCurrentUser ] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
     }
    }, []);
  
  const updateCurrentUser = (newUser: User | null) => {
    setCurrentUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  }

  return (
    <UserContext.Provider value={{ currentUser, updateCurrentUser }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserProvider, UserContext}
