import React, { createContext, useMemo, ReactNode, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface AuthContextValue {
    token: { token: string | null; refreshToken: string | null } | null;
    login: (data: { token: string; refreshToken: string; username: string }) => void;
    logout: () => void;
    username: string | null;
}

export const AuthContext = createContext<AuthContextValue>({
    token: null,
    login: () => { },
    logout: () => { },
    username: null,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tokenData, setTokenData] = useState<{
        token: string | null;
        refreshToken: string | null;
        username: string | null;
    } | null>(() => {
        const storedToken = Cookies.get("authToken");
        return storedToken ? JSON.parse(storedToken) : null;
    });

    const navigate = useNavigate();

    const login = useCallback((data: { token: string; refreshToken: string; username: string }) => {
        console.log("Login data:", data);

        setTokenData(data);
        Cookies.set("authToken", JSON.stringify(data));
        Cookies.set("username", data.username);

        navigate("/");
    }, [navigate]);


    const logout = useCallback(() => {
        navigate("/", { replace: true });
        setTokenData(null);
        Cookies.remove("authToken"); // Remove the token cookie
        Cookies.remove("username"); // Remove the username cookie
    }, [navigate]);

    useEffect(() => {
        Cookies.set("authToken", JSON.stringify(tokenData)); // Update the token cookie
    }, [tokenData]);

    const value = useMemo(
        () => ({
            token: tokenData,
            login,
            logout,
            username: tokenData?.username || null,
        }),
        [login, logout, tokenData]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

