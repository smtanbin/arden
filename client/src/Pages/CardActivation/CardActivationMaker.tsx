

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import {
    Grid,
    Row,
    Col,
    Form,
    FlexboxGrid,
    Divider,
    Button,
    Stack,
    IconButton,
    Message,
    Input,
    Panel,

} from 'rsuite';

import { useAuth } from '../../apps/useAuth';
import useApi from '../../apps/useApi';

import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import Success from '../../assets/success.gif';


type Payload = {
    error: string | null;
    tracking_id: string | null;
};


type FormData = {
    pan: string;
    acno: string;
    title: string;
    contact: string;
    org_branch_code: string;
    massage: string | null;
    attachment: string | null;
    username: string;
};

type CustomerData = {
    acno: string | null,
    title: string | null,
    contact: string | null,
    branchc: string | null,
    error: string | null,
};


const CardActivationMaker: React.FC<{ userprofile?: string }> = () => {
    const auth = useAuth();
    const api = new useApi(auth);
    const userprofile: string = auth.token?.username || 'guest';
    const [uuid, setUuid] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [panError, setPanError] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        pan: '',
        acno: '',
        title: '',
        contact: '',
        org_branch_code: '',
        massage: null,
        attachment: null,
        username: userprofile,
    });
    const [customer, setCustomer] = useState<CustomerData>({
        acno: '',
        title: '',
        contact: '',
        branchc: '',
        error: '',
    });


    const handleBack = () => {
        setUuid('');
        setSuccess(false);
        setFormData({
            pan: '',
            acno: '',
            title: '',
            contact: '',
            org_branch_code: '',
            massage: null,
            attachment: null,
            username: userprofile,
        });
    };




    /* ===================================================================
    
    This function check if card no valid using Luhn mod equtation
    
    ====================================================================== */

    const isLuhnValid = (number: string): boolean => {
        let sum = 0;
        let alternate = false;

        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i), 10);

            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            alternate = !alternate;
        }

        return sum % 10 === 0;
    };







    /* ===================================================================
        This function change state between entry
    ====================================================================== */

    const handleChange = async (name: string, value: string | null) => {
        setError(undefined);
        setPanError(false)

        // Validate PAN
        if (name === 'pan' && value !== null) {
            const trimmedPan = value.replace(/\s/g, ''); // Remove spaces
            const isValidPan = /^\d{16}$/.test(trimmedPan) && isLuhnValid(trimmedPan);

            if (!isValidPan) {
                setPanError(true)
                return;
            } else {
                setLoading(true);
                try {
                    const custInfoResponse = await api.useApi('GET', `/v1/card/activation/account_info/${trimmedPan}`);
                    const custInfo: { data: { title: string; branchc: string; acno: string; contact: string }; error: string | null } = custInfoResponse.data;

                    if (custInfoResponse.status === 200) {
                        setCustomer({
                            title: custInfo.data.title,
                            acno: custInfo.data.acno,
                            contact: custInfo.data.contact,
                            branchc: custInfo.data.branchc,
                            error: null  // Include the error property with a value of null
                        });
                        // Update formData when custInfoResponse has data
                        setFormData((prevData) => ({
                            ...prevData,
                            title: custInfo.data.title,
                            acno: custInfo.data.acno,
                            contact: custInfo.data.contact,
                            org_branch_code: custInfo.data.branchc,
                        }));



                    } else {
                        setError(custInfo.error || "An error occurred");
                    }


                } catch (error) {
                    console.error("Error fetching customer information:", error);
                    setError("An error occurred while fetching customer information");
                } finally {
                    setLoading(false);
                }
            }

        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: value || '',
        }));
    };



    const handleSubmit = async () => {
        try {
            setLoading(true);
            const res = await api.useApi('POST', '/v1/card/activation/add', formData);

            const payload: Payload = res.data

            if (payload && !payload.error) {
                setUuid(`Tracking id ${payload.tracking_id}`);
                setLoading(false);
                setSuccess(true);
            } else {
                setLoading(false);
                alert(`An error occurred. ${payload ? payload.error : 'Unknown error'}`);
            }
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            setError(`${error.response.data.error}`);

        }
    };


    /* ===================================================================
    
    This function retrived image make it base64 and formattted for system
    
    ====================================================================== */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleImageChange = (event: any) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result as string;

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d")!;

                    // Set the canvas size to the desired dimensions

                    canvas.width = 1200;
                    canvas.height = 800;

                    // Draw the image onto the canvas with the desired dimensions
                    ctx.drawImage(img, 0, 0, 1200, 800);

                    // Convert the canvas content to a data URL
                    const resizedImage = canvas.toDataURL("image/jpeg");

                    // Update the form data with the resized image
                    setFormData({
                        ...formData,
                        attachment: resizedImage,
                    });
                };
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <div>

            {success ? (
                <Grid fluid>
                    <Stack direction="column" alignItems="center" spacing={6}>
                        <img src={Success} height="300px" alt="" />
                        <h4 className="display-5 fw-bold">Success {uuid}</h4>
                        <br />
                        <IconButton size="lg" circle
                            onClick={handleBack}
                            color="green"
                            icon={<FontAwesomeIcon icon={faArrowCircleLeft} />}
                        />
                    </Stack>
                </Grid>
            ) : (
                <Form onSubmit={handleSubmit} style={{ padding: '3%' }} fluid>

                    <Grid fluid >
                        <Row className="p-5">
                            <FlexboxGrid>
                                <FlexboxGrid.Item as={Col} colspan={24} md={21}>
                                    <h3 className="p-5">Card Activation Maker</h3>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item as={Col} colspan={24} md={3}>
                                    <br />
                                    <Button style={{ width: '100%' }} size="lg" type="submit" color="green" loading={loading} appearance="primary">Save</Button>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </Row>

                        <Divider />
                        {error ? <Message showIcon type="error" header="Error">
                            {error}
                        </Message> : <></>}
                    </Grid>

                    <Grid fluid>
                        <Row className="show-grid">
                            <Col xs={24} md={12}>
                                <Form>
                                    <Form.Group controlId="pan">
                                        <Form.ControlLabel>Card Number <span style={{ color: 'red' }}>*</span></Form.ControlLabel>
                                        <Form.Control
                                            type="text"
                                            name="pan"
                                            onChange={(value) => handleChange('pan', value)}
                                            placeholder="PAN"
                                        />
                                        <Form.ErrorMessage show={panError}>Invalid PAN. Please enter a valid 16-digit PAN.</Form.ErrorMessage>
                                    </Form.Group>
                                    <Message>
                                        {customer && (
                                            <p>
                                                <b>Title: </b>{customer.title} <br />
                                                <b>AccountNo: </b>{customer.acno} <br />
                                            </p>
                                        )}
                                    </Message>
                                    <br />
                                    <Form.Group>
                                        <Form.ControlLabel>Uploader:</Form.ControlLabel>
                                        <input
                                            style={{
                                                width: '100%',
                                                borderRadius: 4,
                                                border: '1px solid #d9d9d9',
                                                padding: '10px',
                                            }}
                                            type="file"
                                            name="attachment"
                                            accept=".jpg, .jpeg"
                                            onChange={handleImageChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="massage">
                                        <Form.ControlLabel>Massage</Form.ControlLabel>
                                        <Input
                                            placeholder="Massage"
                                            as="textarea"
                                            rows={3}
                                            name="massage"
                                            value={formData.massage}
                                            onChange={(value) => handleChange('massage', value || '')}
                                        />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col xs={24} md={12}>
                                <Panel bodyFill>
                                    {formData.attachment && (
                                        <img
                                            src={formData.attachment}
                                            alt="Image Preview"
                                            style={{ width: '100%' }}
                                        />
                                    )}
                                </Panel>
                            </Col>
                        </Row>
                    </Grid>

                </Form>





            )
            }
        </div>
    );
};





export default CardActivationMaker;


