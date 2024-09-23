import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
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