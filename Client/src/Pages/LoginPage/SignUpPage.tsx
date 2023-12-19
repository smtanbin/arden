import { useState } from 'react';
import { Form, Button, Panel, Stack, Message } from 'rsuite';
import { Link } from 'react-router-dom';


import wallpaper from '../../assets/login/light.svg';
import logo from '../../assets/arden_logo.svg';

const SignUp = () => {

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [contact, setContact] = useState<string>('');
    const [branch, setBranch] = useState<string>('');
    const [permissions, setPermissions] = useState<string>('');
    const [errorState, setErrorState] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);

    const handleSignUp = async () => {
        try {
            const response = await fetch('http://10.140.6.65:4000/api/v1/oauth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    contact,
                    branch,
                    permissions,
                }),
            });

            if (response.ok) {
                const payload = await response.json()
                setSuccess(payload.message + ". Your OTP is" + payload.otp)
            } else {
                const data = await response.json();
                console.log(data.message)
                setErrorState(data.message || 'Error signing up.');
            }
        } catch (error) {
            setErrorState('Internal Server Error');
            console.error('Error signing up:', error);
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

            {success ? <Panel><h1>{success}</h1></Panel>
                : (

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

                        <Form fluid onSubmit={handleSignUp}>
                            <Form.Group>
                                <Form.ControlLabel>First Name</Form.ControlLabel>
                                <Form.Control name="firstName" value={firstName} onChange={value => setFirstName(value)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Last Name</Form.ControlLabel>
                                <Form.Control name="lastName" value={lastName} onChange={value => setLastName(value)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Email address</Form.ControlLabel>
                                <Form.Control name="email" value={email} onChange={value => setEmail(value)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Contact</Form.ControlLabel>
                                <Form.Control name="contact" value={contact} onChange={value => setContact(value)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Branch</Form.ControlLabel>
                                <Form.Control name="branch" value={branch} onChange={value => setBranch(value)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Permissions</Form.ControlLabel>
                                <Form.Control name="permissions" value={permissions} onChange={value => setPermissions(value)} />
                            </Form.Group>
                            <Form.Group>
                                <Button appearance="primary" type="submit" block>Sign Up</Button>
                            </Form.Group>
                        </Form>

                    </Panel>)}
        </Stack>
    );
};

export default SignUp;
