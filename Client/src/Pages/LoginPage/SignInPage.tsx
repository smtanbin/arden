

import { useState } from 'react';
import { Form, Button, Panel, Stack, Message } from 'rsuite';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { useAuth } from '../../apps/useAuth';

import wallpaper from '../../assets/login/light.svg';
import logo from '../../assets/arden_logo.svg';

const SignInPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorState, setErrorState] = useState<string | undefined>(undefined);


    const auth = useAuth();
    const navigate = useNavigate();


    const handelForgetPassword = () => {
        navigate('/PasswordReset');
    }

    const handelSignup = () => {
        navigate('/signup');
    }


    const handleLogin = async () => {

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

                    setErrorState(payload.message)

                } else {
                    const refreshToken = payload.token[1];
                    const token = payload.token[0];

                    auth.login({ username, token, refreshToken });
                    navigate('/', { replace: true });

                }
            } else {
                setErrorState(JSON.stringify(response.statusText))
                console.error('Login failed:', response.status, '<->', response);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setErrorState(error)
            console.error('Login failed:', error.message);
        }
    };

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


            <Panel bordered style={{ background: '#ffffff', width: 400 }} header={
                <img height={'100px'} src={logo} />
            }>
                <p style={{ marginBottom: 10 }}>
                    <span className="text-muted">New Here? </span>{' '}
                    <Link to="/sign-up"> Create an Account</Link>
                </p>

                <Form fluid onSubmit={handleLogin}>


                    <Form.Group>
                        <Form.ControlLabel>Email address</Form.ControlLabel>
                        <Form.Control name="username" value={username} onChange={value => setUsername(value)} /> {/* Update name and add value and onChange props */}
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>
                            <span>Password</span>

                        </Form.ControlLabel>
                        <Form.Control name="password" type="password" value={password} onChange={value => setPassword(value)} />
                    </Form.Group>

                    {errorState ? <Message showIcon type="error">{errorState}</Message> : <></>}
                    <br />
                    <Form.Group>
                        <Button appearance="primary" type="submit" block>Sign in</Button>
                        <Button appearance="link" onClick={handelForgetPassword} block>Forgot password?</Button>
                        <br />
                        <Button appearance="ghost" onClick={handelSignup} block>Signup</Button>
                    </Form.Group>
                </Form>
            </Panel>
        </Stack >
    );
};

export default SignInPage; 
