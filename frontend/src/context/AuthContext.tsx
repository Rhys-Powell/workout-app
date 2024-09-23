import { createContext } from 'react';

export interface AuthContextType {
  token: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
