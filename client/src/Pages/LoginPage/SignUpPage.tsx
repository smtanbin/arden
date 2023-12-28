import { useEffect, useState, useCallback } from 'react';
import { Form, IconButton, Panel, Stack, Message, ButtonGroup, Button, SelectPicker } from 'rsuite';
import { Link } from 'react-router-dom';

import wallpaper from '../../assets/login/signup5098290.svg';
import SendIcon from '@rsuite/icons/Send';
import PageTopIcon from '@rsuite/icons/PageTop';
import logo from '../../assets/logo.svg';
import NetworkRequest from '../../apps/NetworkRequest';
import { useTheme } from '../../Context/TheamProvider'


interface BranchItem {
    label: string;
    value: string;
}

const SignUp = () => {
    const [formData, setFormData] = useState({
        employeeid: '',
        firstName: '',
        lastName: '',
        contact: '',
        email: '',
        branch: ''
    })


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const net = new NetworkRequest()

    const [branch, setBranch] = useState<BranchItem[]>([{ label: 'Select Branch', value: '' }]);
    const [errorState, setErrorState] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);

    const color = useTheme().theme




    const fatchBranch = useCallback(async () => {
        try {
            const data = await net.openRequest('/v1/oauth/branchs')



            if (!data[0].error) {
                const selectData = data[0].payload.map(({ CODE, NAME }: { CODE: string; NAME: string }) => ({
                    label: NAME,
                    value: CODE,
                }));
                setBranch(selectData);
            } else {
                setBranch([{ label: 'Select Branch', value: '' }]);
            }
        } catch (error) {
            console.log(error);
            setBranch([{ label: 'Select Branch', value: '' }]);
        }
    }, [net]);





    /*   ------  Handel Function ---------  */

    const handleChange = (name: string, value: string | null) => {
        if (name === 'employeeid' && value !== null && value.length < 6) {
            setErrorState("Invalid Employee ID");
        } else {
            setErrorState(undefined);
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: value || '',
        }));
    };

    const handleSignUp = async () => {

        if (!formData.employeeid || !formData.firstName || !formData.lastName || !formData.email || !formData.contact || !formData.branch) {
            setErrorState('Please fill in all fields.');
            return;
        }


        try {

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = await net.signup(formData)

            if (data[1] == 200) {
                data[0].error ? setErrorState(data[0].error) :
                    setSuccess(data[0].message)
            } else {

                setErrorState(data[1].error || 'Error signing up.');
            }
        } catch (error) {
            setErrorState('Internal Server Error');
            console.error('Error signing up:', error);
        }
    };




    useEffect(() => {
        fatchBranch()
    }, [])




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


            {success ? <Panel
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
                    <p>{success}</p>
                    <br />
                    <ButtonGroup>
                        <Link to={"/login"}>
                            <IconButton appearance="primary" icon={<PageTopIcon />}>Back to Login</IconButton>
                        </Link>
                    </ButtonGroup>
                </Stack>
            </Panel>
                : (
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

                        <Panel header={
                            <Stack justifyContent="space-between">
                                <ButtonGroup>
                                    <Link to={"/login"}>
                                        <IconButton icon={<PageTopIcon />}>Back</IconButton>
                                    </Link>
                                </ButtonGroup>
                                <h3>SIGNUP</h3>
                            </Stack>
                        }>


                            <br />

                            <br />
                            <Form fluid onSubmit={handleSignUp}>
                                <Stack
                                    justifyContent="flex-start"
                                    alignItems="flex-start"
                                    direction="row"
                                    spacing={9}

                                >
                                    <Stack
                                        justifyContent="flex-start"
                                        alignItems="flex-start"
                                        direction="column"
                                        spacing={9}

                                    >

                                        <Form.Group controlId='employeeid'>
                                            <Form.ControlLabel>Employee ID</Form.ControlLabel>
                                            <Form.Control type="number" name="employeeid" value={formData.employeeid} onChange={(value) => handleChange('employeeid', value)} />
                                        </Form.Group>
                                        <Form.Group controlId='firstName'>
                                            <Form.ControlLabel>First Name</Form.ControlLabel>
                                            <Form.Control type="text" name="firstName" value={formData.firstName} onChange={(value) => handleChange('firstName', value)} />
                                        </Form.Group>
                                        <Form.Group controlId='lastName'>
                                            <Form.ControlLabel>Last Name</Form.ControlLabel>
                                            <Form.Control type="text" name="lastName" value={formData.lastName} onChange={(value) => handleChange('lastName', value)} />
                                        </Form.Group>

                                    </Stack>
                                    <Stack
                                        justifyContent="flex-start"
                                        alignItems="flex-start"
                                        direction="column"
                                        spacing={9}
                                    >
                                        <Form.Group controlId='email'>
                                            <Form.ControlLabel>Email address</Form.ControlLabel>
                                            <Form.Control type="email" name="email" value={formData.email} onChange={(value) => handleChange('email', value)} />
                                        </Form.Group>

                                        <Form.Group controlId='contact'>
                                            <Form.ControlLabel>Contact</Form.ControlLabel>
                                            <Form.Control type="number" name="contact" value={formData.contact} onChange={(value) => handleChange('contact', value)} />
                                        </Form.Group>



                                        <Form.Group controlId="branch">
                                            <Form.ControlLabel>Branch</Form.ControlLabel>
                                            <SelectPicker
                                                data={branch}
                                                placeholder="Select Branch"
                                                name="branch"
                                                value={formData.branch}
                                                onChange={(value) => handleChange('branch', value)}
                                            />

                                        </Form.Group>
                                    </Stack>
                                </Stack>
                                {errorState ? <><hr /><Message showIcon type="error">{errorState}</Message></> : <></>}
                                <hr />

                                <Button block appearance="primary" type="submit" > <SendIcon /> Sign Up</Button>
                            </Form>

                        </Panel>
                    </Panel>)
            }
        </Stack >
    );
};

export default SignUp;
