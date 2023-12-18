

import React, { useState } from 'react'; // Import useState hook
import { Form, Button, Panel, Stack, Divider } from 'rsuite';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { useAuth } from '../../apps/useAuth';

import wallpaper from '../../assets/login/light.svg';

const SignInPage = () => {

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


            <Panel bordered style={{ background: '#fff', width: 400 }} header={<h3>Sign In</h3>}>
                <p style={{ marginBottom: 10 }}>
                    <span className="text-muted">New Here? </span>{' '}
                    <Link to="/sign-up"> Create an Account</Link>
                </p>

                <Form fluid onSubmit={handleLogin}>
                    <Form.Group>
                        <Form.ControlLabel>Username or email address</Form.ControlLabel>
                        <Form.Control name="username" value={username} onChange={value => setUsername(value)} /> {/* Update name and add value and onChange props */}
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>
                            <span>Password</span>
                            <a style={{ float: 'right' }}>Forgot password?</a>
                        </Form.ControlLabel>
                        <Form.Control name="password" type="password" value={password} onChange={value => setPassword(value)} /> {/* Update name and add value and onChange props */}
                    </Form.Group>
                    <Form.Group>
                        <Stack spacing={6} divider={<Divider vertical />}>
                            <Button appearance="primary" type="submit">Sign in</Button> {/* Add type="submit" prop */}
                        </Stack>
                    </Form.Group>
                </Form>
            </Panel>
        </Stack >
    );
};

export default SignInPage; // Rename component to SignInPage
