// import { useEffect } from "react";
// import { Navigate } from "react-router-dom";

// import LandingPage from "../LandingPage";
// import ErrorPage from "../Pages/errorPage";
// import { useAuth } from "../apps/useAuth";
// import Api from "../apps/useApi";


// const SecureRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const auth = useAuth();
//     const api = new Api(auth);

//     const fatchRights = async () => {
//         return await api.useApi('GET', `/users/permission/${auth.username}`)
//     }

//     useEffect(() => {

//         fatchRights().then((data) => {
//             console.log("permission", data)
//             console.log("children", children)
//         })

//     }, [])



//     if (auth.token?.token) {
//         return <LandingPage>{children}</LandingPage>;
//     } else {

//         return <Navigate to="/login" replace />;
//     }
//     return <ErrorPage />;
// };


// export default SecureRoute;

import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

import LandingPage from "../LandingPage";
import { useAuth } from "../apps/useAuth";
import Api from "../apps/useApi";


const SecureRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuth();
    const api = new Api(auth);
    const location = useLocation();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    // Define the routes to ignore from the authorization check
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const ignoreRoutes = ["/", "/home", "noPermissionPage"];

    useEffect(() => {
        const checkPermissions = async () => {
            if (!auth.token?.token) {
                // If token is not present, navigate to login
                return <Navigate to="/login" replace />;
            }

            try {
                const data: { "prime": boolean, "routes": string[] } = await api.useApi('GET', `/users/permission/${auth.username}`);
                // Convert current route path to lowercase for case-insensitive comparison
                const currentRoute = location.pathname.toLowerCase();

                if (data.prime) setIsAuthorized(true);
                else if (ignoreRoutes.includes(currentRoute)) setIsAuthorized(true);
                else {
                    // Check if the current route is in the ignore list
                    const lowercasedRoutes = data.routes.map(route => route.toLowerCase());
                    setIsAuthorized(lowercasedRoutes.includes(currentRoute));
                }
            } catch (error) {
                // Handle error, e.g., redirect to an error page
                console.error("Error fetching rights:", error);
                setIsAuthorized(false);
            }
        };

        checkPermissions();
    }, [auth.token?.token, auth.username, location.pathname, api, ignoreRoutes]);


    if (isAuthorized === null) {
        console.log("isAuthorized === null");
        return <Navigate to="/" replace />
    }

    if (isAuthorized) {
        return <LandingPage>{children}</LandingPage>;
    }

    console.log("Current route does not match any allowed routes.");
    // Handle unauthorized access, redirect to '/'
    return <Navigate to="/noPermissionPage" replace />
};

export default SecureRoute;



