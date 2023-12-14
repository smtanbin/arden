import React from "react";
import { Navigate } from "react-router-dom";

import LandingPage from "../LandingPage";
import ErrorPage from "../Pages/errorPage";
import { useAuth } from "../apps/useAuth";


const SecureRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token } = useAuth();

    if (token) {
        return <LandingPage>{children}</LandingPage>;
    } else {

        return <Navigate to="/login" replace />;
    }
    return <ErrorPage />;
};


export default SecureRoute;