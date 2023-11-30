import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import LandingPage from "../LandingPage";
import ErrorPage from "../Pages/errorPage";


const SecureRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { sessionID } = useAuth();
    if (sessionID) {
        // if (sessionID !== null) {

        return <LandingPage>{children}</LandingPage>;
        // }
    } else {

        return <Navigate to="/login" replace />;
    }
    return <ErrorPage />;
};


export default SecureRoute;