import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Content, FlexboxGrid } from "rsuite";

const NoPermissionPage: React.FC = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate("/home");
    };

    return (
        <Container>
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
        </Container>
    );
};

export default NoPermissionPage;