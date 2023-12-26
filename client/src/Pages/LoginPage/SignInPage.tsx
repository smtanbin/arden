

import { useEffect, useState } from 'react';
import { Form, Button, Panel, Stack, Message } from 'rsuite';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { useAuth } from '../../apps/useAuth';

import wallpaper from '../../assets/login/light.svg';
import logo from '../../assets/logo.svg';
import '../../styles/index.css'
import NetworkRequest from '../../apps/NetworkRequest';
import { useTheme } from '../../Context/TheamProvider';

const SignInPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState<string | undefined>(undefined);
    const [errorState, setErrorState] = useState<string | undefined>(undefined);
    const [previousLoginState, setPreviousLoginState] = useState<string | undefined>(undefined);
    const [passwordChange, setPasswordChange] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>('');
    const [newPasswordValidation, setNewPasswordValidation] = useState<boolean>(false);


    const net = new NetworkRequest()
    const auth = useAuth();
    const navigate = useNavigate();
    const color = useTheme().theme


    const handelNotLogin = () => {
        setPreviousLoginState(undefined)
    }
    const handelForgetPassword = () => {
        navigate('/PasswordReset');
    }

    const handelSignup = () => {
        navigate('/signup');
    }

    const handleNewPassword = (value1: string, value2: string) => {
        setNewPassword(value1)
        if (value1 == value2) {
            console.log("match")
            setNewPasswordValidation(false);
        } else {
            setNewPasswordValidation(true);
        }
    };


    const handleLogin = async () => {

        setErrorState(undefined)




        try {
            const payload = await net.login(username, password);

            if (payload) {

                if (payload.message !== 'success') {

                    setErrorState(payload.message)

                } else {

                    const refreshToken = payload.token[1];
                    const token = payload.token[0];
                    fatchLoginInfo(username, token, refreshToken)
                }
            } else {
                setErrorState(payload)
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setErrorState(error)
            console.error('Login failed:', error.message);
        }
    };

    const fatchLoginInfo = async (username: string, token: string, refreshToken: string) => {
        try {
            const response = await net.openRequest(`/v1/oauth/last_login/${username}`)

            if (response[1] == 200) {
                auth.login({ username, token, refreshToken });
                navigate('/', { replace: true });
            } else if (response[1] === 205) {
                setPasswordChange(true);
            } else {
                setErrorState(`Unexpected response status: ${response[1]}`);
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setErrorState(error.message);
            console.error('Login failed:', error.message);
        }
    };

    const submitResetPassword = async () => {
        try {

            const response = await net.ResetPassword(username, password, newPassword);

            if (response.status === 200) {
                navigate('/', { replace: true });

            } else {
                // Handle other status codes or errors
                setErrorState(`Unexpected response status: ${response.status}`);
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setErrorState(error.message);
            console.error('Login failed:', error.message);
        }
    };


    useEffect(() => {
        const user = localStorage.getItem("username")
        if (user) setUsername(user)
        setPreviousLoginState(user?.toString())

        if (password === undefined) {
            setPassword('');
        }
    }, []);



    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            direction="column"
            style={{
                height: '100vh',
                backgroundImage: `url(${wallpaper})`,
                backgroundSize: 'cover',
            }}
        >


            <Panel
                bordered
                shaded
                style={{
                    background: color == 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    color: color == 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                    width: 400
                }}>

                <Stack
                    alignItems="center"
                    direction="column"
                    style={{
                        padding: 15
                    }}
                >
                    <img height={'50px'} src={logo} />
                </Stack>
                <Panel header={<h3>Login</h3>}>




                    {!passwordChange ? <Form fluid onSubmit={handleLogin}>
                        {previousLoginState ?
                            <span onClick={handelNotLogin}>
                                <Message>
                                    <p>Login as <b>{username}</b></p>
                                </Message>
                                <p style={{ textAlign: "right" }}>Not <span style={{ color: 'dodgerblue' }}>{previousLoginState}</span> ?</p>
                            </span>
                            :
                            <Form.Group>
                                <Form.ControlLabel>Email address</Form.ControlLabel>
                                <Form.Control name="username" value={username} onChange={value => setUsername(value)} /> {/* Update name and add value and onChange props */}
                            </Form.Group>
                        }
                        <Form.Group>
                            <Form.ControlLabel>
                                <span>Password</span>
                            </Form.ControlLabel>
                            <Form.Control name="password" type="password" value={password} onChange={value => setPassword(value)} />
                            <Button appearance="link" onClick={handelForgetPassword} block>Forgot password?</Button>
                        </Form.Group>


                        {errorState ? <Message showIcon type="error">{errorState}</Message> : <></>}
                        <br />

                        <Form.Group>
                            <Button appearance="primary" type="submit" block>Sign in</Button>

                            <br />
                            <span className="text-muted">New Here? </span>
                            <br />
                            <Button appearance="ghost" onClick={handelSignup} block>Signup</Button>
                        </Form.Group>
                    </Form>
                        :
                        <Form onSubmit={submitResetPassword}>
                            <Form.Group>
                                <Form.ControlLabel>
                                    <span>Password</span>
                                </Form.ControlLabel>
                                <Form.Control name="password1" type="password" onChange={(value) => handleNewPassword(value, '')} />
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>
                                    <span>Confirm Password</span>
                                </Form.ControlLabel>
                                <Form.Control
                                    name="password2"
                                    type="password"
                                    errorMessage={newPasswordValidation ? "Password not match" : newPasswordValidation}
                                    onChange={(value) => handleNewPassword(newPassword, value)}
                                />

                            </Form.Group>
                            {errorState ? <Message showIcon type="error">{errorState}</Message> : <></>}
                            <br />
                            <Form.Group>
                                <Button appearance="primary" type="submit" block>
                                    Save Password
                                </Button>
                            </Form.Group>
                        </Form>
                    }
                </Panel>
            </Panel>
        </Stack >
    );
};

export default SignInPage; 
