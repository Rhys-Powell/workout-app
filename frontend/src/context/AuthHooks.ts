import { useContext } from 'react';
import { AuthContext, AuthContextType } from './AuthProvider';

export function useAuth(): AuthContextType | null {
  return useContext(AuthContext);
}
