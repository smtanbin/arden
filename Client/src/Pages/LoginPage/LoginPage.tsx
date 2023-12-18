// Import React and necessary components
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, IconButton } from 'rsuite';
import { Icon } from '@rsuite/icons';
import styled from 'styled-components';

import wallpaper from '../../assets/login/light.svg';
import logo from '../../assets/arden_logo.svg';
import { useAuth } from '../../apps/useAuth';

// Styled components
const LoginPageWrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const Wallpaper = styled.div`
  flex: 1;
  background: url(${wallpaper}) center/cover;

  @media (min-width: 768px) {
    display: block;
  }

  background-size: cover;
`;

const LoginContainer = styled(Container)`
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  background-color: rgba(255, 255, 255, 0.5);

  @media (min-width: 768px) {
    max-width: 500px;
    display: block;
  }
`;

const LoginForm = styled(Form)`
  max-width: 400px;
  width: 100%;
`;

const OTPForm = styled(Form)`
  max-width: 400px;
  width: 100%;
`;

// Main component
const LoginPage: React.FC = () => {
    const [forgotPassword, setForgotPassword] = useState(false);
    const [otpScreen, setOtpScreen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        const data: { username: string; password: string } = {
            username,
            password,
        };

        try {
            const response = await fetch('http://10.140.6.65:4000/api/v1/oauth/login', {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const payload = await response.json();

                if (payload.message !== 'success') {
                    alert('Login failed');
                } else {
                    const refreshToken = payload.token[1];
                    const token = payload.token[0];

                    auth.login({ username, token, refreshToken });
                    navigate('/', { replace: true });
                }
            } else {
                console.error('Login failed:', response.status, response.statusText);
            }
        } catch (error: Error) {
            console.error('Login failed:', error.message);
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
                                <IconButton

                                    appearance="link"
                                    size="lg"
                                    onClick={handleBackTo}
                                >
                                    Back to Login
                                </IconButton>
                                <Button appearance="primary" onClick={handleGetOtp}>
                                    Get OTP
                                </Button>
                            </Col>
                        </Row>
                    </div>
                ) : otpScreen && !forgotPassword ? (
                    <OTPForm onSubmit={handleOTPSubmit}>
                        <Row className="mb-3">
                            <Col xs={12}>
                                <IconButton

                                    appearance="link"
                                    size="lg"
                                    onClick={handleBackTo}
                                >
                                    Back to Login
                                </IconButton>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>Enter the OTP sent to {username}</Col>
                        </Row>
                        <br />
                        <Row className="mb-3">
                            <Col>
                                <Form.Control type="text" placeholder="Enter OTP" />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs={12}>
                                <Button appearance="outline" onClick={handleOTPSubmit}>
                                    Submit OTP
                                </Button>
                            </Col>
                        </Row>
                    </OTPForm>
                ) : (
                    <LoginForm onSubmit={handleLogin}>
                        <Row className="mb-3">
                            <Col>
                                <img className="p-3" src={logo} alt="Logo" style={{ width: '100%', height: 'auto' }} />
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
                        <br />
                        <Row className="mb-3">
                            <Col>
                                <Button appearance="primary" onClick={handleLogin}>
                                    Login
                                </Button>
                                <span className="mx-2"></span>
                                <Button appearance="ghost" onClick={handleForgotPassword}>
                                    Forgot Password?
                                </Button>
                            </Col>
                        </Row>
                    </LoginForm>
                )}
            </LoginContainer>
        </LoginPageWrapper>
    );
};

export default LoginPage;
