import { useState } from 'react';
import { Form, Button, Panel, Stack, Message } from 'rsuite';
import { Link } from 'react-router-dom';


import wallpaper from '../../assets/login/light.svg';
import logo from '../../assets/arden_logo.svg';

const PasswordReset = () => {

    const [username, setUsername] = useState<string | undefined>(undefined);
    const [otpStage, setOtpStage] = useState<boolean>(false);
    const [otp, setOtp] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string | undefined>(undefined); // Add password state
    const [errorState, setErrorState] = useState<string | undefined>(undefined);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

    const handleSendOtp = async () => {
        try {
            // Disable the button when sending OTP
            setIsButtonDisabled(true);

            const response = await fetch(`http://10.140.6.65:4000/api/v1/oauth/reset_otp/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log(response);
                setErrorState(undefined);
                setOtpStage(true);

                // Enable the button after 30 seconds
                setTimeout(() => {
                    setIsButtonDisabled(false);
                }, 30000);
            } else if (response.status === 404) {
                setErrorState('User not found.');
            } else {
                const data = await response.json();
                setErrorState(data.message || 'Error sending OTP.');
                setIsButtonDisabled(false); // Enable the button on error
            }
        } catch (error) {
            console.log(error);
            setErrorState('Internal Server Error');
            console.error('Error sending OTP:', error);
            setIsButtonDisabled(false); // Enable the button on error
        }
    };


    const handlePasswordReset = async () => {
        try {
            const response = await fetch('http://10.140.6.65:4000/api/v1/oauth/forget_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    otp,
                    new_password: password,
                }),
            });

            if (response.ok) {
                setErrorState('');
                // Handle success (perhaps redirect the user to login)
            } else {
                const data = await response.json();
                setErrorState(data.message || 'Error resetting password.');
            }
        } catch (error) {
            setErrorState('Internal Server Error');
            console.error('Error resetting password:', error);
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
                <br />
                {errorState ? <Message showIcon type="error">{errorState}</Message> : <></>}
                <br />

                <Form fluid onSubmit={handleSendOtp}>
                    <Form.Group>
                        <Form.ControlLabel>Email address</Form.ControlLabel>
                        <Form.Control name="username" value={username} onChange={(value) => setUsername(value)} />
                    </Form.Group>
                    <Form.Group>
                        <Button disabled={isButtonDisabled} appearance="primary" onClick={handleSendOtp} block>
                            {isButtonDisabled ? `Retry in 30s` : 'Send OTP'}
                        </Button>
                    </Form.Group>
                </Form>

                {otpStage && (
                    <Form fluid onSubmit={handlePasswordReset}>
                        <Form.Group>
                            <Form.ControlLabel>Enter OTP</Form.ControlLabel>
                            <Form.Control name="otp" value={otp} onChange={value => setOtp(value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>New Password</Form.ControlLabel>
                            <Form.Control name="password" type="password" value={password} onChange={value => setPassword(value)} />
                        </Form.Group>
                        <Form.Group>

                            <Button appearance="primary" type="submit">Reset Password</Button>
                        </Form.Group>
                    </Form>
                )}
            </Panel>
        </Stack>
    );
};

export default PasswordReset;
