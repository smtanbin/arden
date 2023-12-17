// LoginPage.tsx
import React, { useState } from 'react';
import { Container, Row, Col, Form, Image } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import CustomButton from '../Components/CustomButtons';
import { ArrowLeft } from 'react-bootstrap-icons';
import styled from 'styled-components';
import wallpaper from '../assets/login.svg'
import logo from '../assets/arden_logo.svg'
import { useAuth } from '../apps/useAuth';




const LoginPageWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const Wallpaper = styled.div`
  flex: 1;
  background: url(${wallpaper}) center/cover;
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
`;

const LoginContainer = styled(Container)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginForm = styled(Form)`
  max-width: 400px;
  width: 100%;
`;

const OTPForm = styled(Form)`
  max-width: 400px;
  width: 100%;
`;

const LoginPage: React.FC = () => {
    const [forgotPassword, setForgotPassword] = useState(false);
    const [otpScreen, setOtpScreen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);



    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        const data: { username: string; password: string } = {
            username,
            password,
        };

        try {
            const response = await fetch("http://10.140.6.65:4000/api/v1/oauth/login", {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const payload = await response.json();

                if (payload.message != 'success') alert("Login failed")

                const refreshToken = payload.token[1]
                const token = payload.token[0]

                auth.login({ username, token, refreshToken });
                navigate("/", { replace: true });


            } else {
                setError(response.statusText)
                console.error("Login failed:", response.status, response.statusText);

            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Login failed:", error.message);
        }
    };


    const handleForgotPassword = () => {
        setForgotPassword(true);
    };

    const handleGetOtp = () => {
        setForgotPassword(false);
        setOtpScreen(true);
    };

    const handleBackTo = () => {
        setForgotPassword(false);
        setOtpScreen(false);
    };

    const handleOTPSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle OTP submission logic here
    };

    return (

        <LoginPageWrapper>
            <Wallpaper />
            <LoginContainer>
                {forgotPassword && !otpScreen ? (
                    <div>
                        <Row className="mb-3">

                            <Col>
                                <p className="mx-5">Reset Password for {username}</p>

                                <br />
                                <br />
                                <CustomButton variant="regular" onClick={handleBackTo} icon={<ArrowLeft />}
                                    text='Back to Login' type={undefined} color={undefined} />
                                <CustomButton variant="primary" text="Get OTP" onClick={handleGetOtp} color={undefined} />


                            </Col>
                        </Row>

                    </div>
                ) : (otpScreen && !forgotPassword ? (<OTPForm onSubmit={handleOTPSubmit}>
                    <Row className="mb-3">
                        <Col xs={12}>
                            {/* Make it icon button */}

                            <CustomButton variant="regular" onClick={handleBackTo} icon={<ArrowLeft />}
                                text='Back to Login' type={undefined} color={undefined} />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            Enter the OTP sended to {username}
                        </Col>
                    </Row>
                    <br />
                    <Row className="mb-3">
                        <Col>
                            <Form.Control type="text" placeholder="Enter OTP" />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={12}>
                            <CustomButton variant="outline" text="Submit OTP" type="submit" color={undefined} />
                        </Col>
                    </Row>
                </OTPForm>) :
                    <LoginForm onSubmit={handleLogin}>
                        <Row className="mb-3">
                            <Col>
                                <Image
                                    className="p-3"
                                    src={logo}

                                    alt="Logo" fluid />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Col>
                        </Row>
                        {error ? <><br /><Row>
                            <div className="rounded p-1 bg-warning p-2 text-dark bg-opacity-50 text-center">
                                {error.toString()}
                            </div>
                        </Row></> : <></>}
                        <br />
                        <Row className="mb-3">
                            <Col>
                                <CustomButton variant="primary" color={undefined} text="Login" type={"submit"} />

                                <span className='mx-2'></span>

                                <CustomButton onClick={handleForgotPassword} variant="outline" color={undefined} text="Forgot Password?" type={"submit"} />
                            </Col>
                        </Row>

                    </LoginForm>
                )}
            </LoginContainer>

        </LoginPageWrapper>

    );
};

export default LoginPage
