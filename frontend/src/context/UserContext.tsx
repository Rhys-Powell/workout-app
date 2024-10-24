import React, { createContext, useState } from 'react';
import { User } from '../types/User';

export interface UserContextType {
  currentUser: User | null;
  updateCurrentUser (user: User | null) : void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [ currentUser, setCurrentUser ] = useState<User | null>(null);

  const updateCurrentUser = (newUser: User | null) => {
    setCurrentUser(newUser);
  }

  return (
    <UserContext.Provider value={{ currentUser, updateCurrentUser }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserProvider, UserContext}
