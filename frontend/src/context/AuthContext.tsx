import { useAuth0, User } from "@auth0/auth0-react";
import React, { useEffect, useState, createContext } from "react";

export interface AuthContextType {
  token: string | null;
  user: User | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode })  => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
      const fetchToken = async () => {
      const accessToken = await getAccessTokenSilently();
      setToken(accessToken);
    };
      fetchToken();
  }, [getAccessTokenSilently]);

  return (
      <AuthContext.Provider value={{ token, user }}>
          {children}
      </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext}
