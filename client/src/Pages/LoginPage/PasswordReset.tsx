import { useState } from 'react';
import { Form, Button, Panel, Stack, Message, ButtonGroup } from 'rsuite';



import wallpaper from '../../assets/login/signup5098290.svg';
import logo from '../../assets/arden_logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import NetworkRequest from '../../apps/NetworkRequest';
import { useTheme } from '../../Context/TheamProvider';

const PasswordReset = () => {

    const [username, setUsername] = useState<string | undefined>(undefined);
    const [otpStage, setOtpStage] = useState<boolean>(false);
    const [otp, setOtp] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string | undefined>(undefined); // Add password state
    const [errorState, setErrorState] = useState<string | undefined>(undefined);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);


    const navigate = useNavigate();
    const color = useTheme().theme
    const net = new NetworkRequest()
    const handleSendOtp = async () => {
        try {
            // Disable the button when sending OTP
            setIsButtonDisabled(true);

            const response = await net.openRequest(`/v1/oauth/reset_otp/${username}`)

            if (response[1] == 200) {
                console.log(response);
                setErrorState(undefined);
                setOtpStage(true);

                // Enable the button after 30 seconds
                setTimeout(() => {
                    setIsButtonDisabled(false);
                }, 30000);
            } else if (response[1] == 404) {
                setErrorState('User not found.');
            } else {

                setErrorState(response[0].message || 'Error sending OTP.');
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
            const response = await net.ForgetPassword(username, otp, password)

            if (response) {
                setErrorState('');
                navigate('/login', { replace: true });
                // Handle success (perhaps redirect the user to login)
            } else {

                setErrorState('Error resetting password.');
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
                >     <ButtonGroup>

                    </ButtonGroup>
                    <img height={'50px'} src={logo} />
                </Stack>

                <Panel header={<h5>Reset Password</h5>}>
                    {errorState ? <Message showIcon type="error">{errorState}</Message> : <></>}
                    <Form fluid onSubmit={handleSendOtp}>
                        <Form.Group>
                            <Form.ControlLabel>Email address</Form.ControlLabel>
                            <Form.Control name="username" value={username} onChange={(value) => setUsername(value)} />
                        </Form.Group>
                        <Form.Group>
                            <Button disabled={isButtonDisabled} appearance="primary" onClick={handleSendOtp} block>
                                {isButtonDisabled ? `Retry in 30s` : 'Send OTP'}
                            </Button>
                            <br />
                            <Link to={"/login"}>
                                <Button appearance="ghost" block>Back</Button>
                            </Link>
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

                                <Button appearance="primary" type="submit" block>Reset Password</Button>
                                <br />
                                <Link to={"/login"}>
                                    <Button appearance="ghost" block>Back</Button>
                                </Link>
                            </Form.Group>

                        </Form>
                    )}

                </Panel>
            </Panel>
        </Stack>

    );
};

export default PasswordReset;
