import React, { useState, useEffect, useCallback } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import LandingPage from "../LandingPage";
import { useAuth } from "../apps/useAuth";
import image403 from "../assets/403.svg";
import Api from "../apps/useApi";
import { Content, FlexboxGrid, Button, Stack } from "rsuite";

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
    return (
        <Content>
            {/* <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><linearGradient id='a11'><stop offset='0' stop-color='#00C98D' stop-opacity='0'></stop><stop offset='1' stop-color='#00C98D'></stop></linearGradient><circle fill='none' stroke='url(#a11)' stroke-width='15' stroke-linecap='round' stroke-dasharray='0 44 0 44 0 44 0 44 0 360' cx='100' cy='100' r='70' transform-origin='center'><animateTransform type='rotate' attributeName='transform' calcMode='discrete' dur='2' values='360;324;288;252;216;180;144;108;72;36' repeatCount='indefinite'></animateTransform></circle></svg> */}

            <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={12}>
                    <Stack direction="column" alignItems="center" spacing={9}>
                        <img src={image403} style={{ height: "50vh" }} />
                        <Button
                            size="lg"
                            appearance="ghost"
                            color="green"
                            onClick={handleBackToHome}
                            style={{ marginTop: "20px" }}
                        >
                            Back to Home
                        </Button>
                    </Stack>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </Content>
    )
};

export default SecureRoute;






