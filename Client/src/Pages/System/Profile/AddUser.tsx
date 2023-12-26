import { useEffect, useState, useCallback } from 'react';
import { Form, Stack, Message, Button, SelectPicker, Container, Col, Grid } from 'rsuite';



import SendIcon from '@rsuite/icons/Send';
import NetworkRequest from '../../../apps/NetworkRequest';


const AddUser = () => {
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


    const [errorState, setErrorState] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);















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







    return (
        <Container>

            <Grid>
                <Col>
                    <img src={ } />
                </Col>
                <Col>
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




                            </Stack>
                        </Stack>
                        {errorState ? <><hr /><Message showIcon type="error">{errorState}</Message></> : <></>}
                        <hr />

                        <Button block appearance="primary" type="submit" > <SendIcon /> Sign Up</Button>
                    </Form>
                </Col>
            </Grid>







        </Container >
    );
};

export default AddUser;
