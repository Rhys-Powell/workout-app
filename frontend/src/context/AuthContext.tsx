import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState, createContext } from "react";

export interface AuthContextType {
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode })  => {
  const { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
      const fetchToken = async () => {
      const accessToken = await getAccessTokenSilently();
      setToken(accessToken);
      };

      fetchToken();
  }, [getAccessTokenSilently]);

  return (
      <AuthContext.Provider value={{ token }}>
          {children}
      </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext}
