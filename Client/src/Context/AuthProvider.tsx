import React, { createContext, useContext, useMemo, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

interface AuthContextValue {
    username: string | null;
    sessionID: string | null;
    login: (data: { username: string, sessionID: string }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
    username: null,
    sessionID: null,
    login: async () => { },
    logout: () => { },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    const login = async (data: { username: string, sessionID: string }) => {
        Cookies.set('sessionID', data.sessionID);
        Cookies.set('username', data.username);
        navigate("/loading");
    };

    const logout = () => {
        Cookies.remove('sessionID');
        Cookies.remove('username');
        navigate("/loading", { replace: true });
    };

    const sessionID = Cookies.get('sessionID') || null;
    const username = Cookies.get('username') || null;

    const value = useMemo(
        () => ({
            username,
            sessionID,
            login,
            logout,
        }),
        [username, sessionID]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
    return useContext(AuthContext);
};
