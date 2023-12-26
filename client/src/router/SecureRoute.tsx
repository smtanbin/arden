import React, { useState, useEffect, useCallback } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import LandingPage from "../LandingPage";
import { useAuth } from "../apps/useAuth";
import Api from "../apps/useApi";
import { Container, Content, FlexboxGrid, Button } from "rsuite";

export const ignoreRoutes = ["/", "noPermissionPage", "/home", "/noPermissionPage"];

const SecureRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuth();
    const api = new Api(auth);

    const location = useLocation();
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate("/home");
    };

    const checkPermissions = useCallback(async () => {
        try {
            const response = await api.useApi('GET', `/users/permission/${auth.username}`);
            const currentRoute = location.pathname.toLowerCase();


            if (
                response.data.includes("prime") ||
                ignoreRoutes.includes(currentRoute) ||
                response.data.includes(currentRoute)
            ) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
                console.log("Current route does not match any allowed routes.");
            }
        } catch (error) {
            return <Navigate to="/500" replace />;
            console.error("Error fetching rights:", error);
            setIsAuthorized(false);
        }
    }, [api, auth.username, location.pathname]);

    useEffect(() => {
        checkPermissions();
    }, [checkPermissions]);

    if (!auth.token?.token) {
        // Return Navigate component when the token is not present
        return <Navigate to="/login" replace />;
    }

    if (isAuthorized) {
        return <LandingPage>{children}</LandingPage>;
    }

    // Handle unauthorized access, redirect to '/'
    return (<Container>
        <Content style={{ marginTop: "50px" }}>
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={12}>
                    <div style={{ textAlign: "center" }}>

                        <h3 style={{ marginTop: "20px" }}>No Permission</h3>
                        <p>
                            You do not have the required permissions to access this page.
                        </p>
                        <Button
                            appearance="primary"
                            onClick={handleBackToHome}
                            style={{ marginTop: "20px" }}
                        >
                            Back to Home
                        </Button>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </Content>
    </Container>)
};

export default SecureRoute;






















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
