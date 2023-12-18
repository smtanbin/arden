import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import BackIcon from "../../assets/icons/back.svg"
import Success from "../../assets/success.gif"

import { useAuth } from '../../apps/useAuth';
import useApi from '../../apps/useApi';
import CustomButton from '../../Components/CustomButtons';

type Payload = {
    error: string | null;
    uuid: string | null;
}

type FormData = {
    pan: string;
    acno: string;
    txn_date: string;
    org_id: string;
    org_branch_code: string;
    acquirer: string;
    merchant_name: string;
    merchant_location: string;
    tr_amt: string;
    channel: string;
    attachment: string | null;
    maker_user: string | null;
};

const DisputeEntry: React.FC<{ userprofile?: string }> = () => {

    const auth = useAuth();
    const api = new useApi(auth);
    const userprofile: string = auth.token?.username || 'guest';


    const [uuid, setUuid] = useState<string>("")
    const [success, setSuccess] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState<FormData>({
        pan: '',
        acno: '',
        txn_date: '',
        org_id: '',
        org_branch_code: '',
        acquirer: '',
        merchant_name: '',
        merchant_location: '',
        tr_amt: '',
        channel: '',
        attachment: null,
        maker_user: userprofile
    });



    const [customerName, setCustomerName] = useState<string>("")

    const handleBack = () => {
        setUuid("")
        setSuccess(false)
        setFormData({
            pan: '',
            acno: '',
            txn_date: '',
            org_id: '',
            org_branch_code: '',
            acquirer: '',
            merchant_name: '',
            merchant_location: '',
            tr_amt: '',
            channel: '',
            attachment: null,
            maker_user: userprofile
        });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomerName(value)
        setFormData({
            ...formData,
            [name]: value || '',
            pan: name === 'pan' ? value || '' : formData.pan,
            acno: name === 'acno' ? value || '' : formData.acno,
        });
    };


    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

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



    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {

            console.log(formData)

            setLoading(true)
            const payload: Payload = await api.useApi('POST', '/v1/dispute/add', formData)
            if (payload && !payload.error) {
                setUuid("Dispute added Tracking id " + payload.uuid)
                setLoading(false)
                setSuccess(true)
            }
            else {
                setLoading(false)
                alert("An error occurred. " + (payload ? payload.error : "Unknown error"));
            }
            setLoading(false)


        } catch (error) {
            setLoading(false)
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Container>
            {success ?
                <div className="px-4 py-5 my-5 text-center">
                    <img src={Success} height="300px" alt="" />
                    <h1 className="display-5 fw-bold">Success</h1>
                    <div className="col-lg-6 mx-auto">
                        <p className="lead mb-4">{uuid}</p>
                        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                            <CustomButton loading={false} variant={'outline'} icon={<img src={BackIcon} height="20px" />} text="Go Back" onClick={handleBack} />
                        </div>
                    </div>
                </div>
                :
                <><div className='mt-4 p-5 p-center' style={{ color: '#053223' }}>

                    <h1 className='p-5'>Add Dispute</h1>
                </div>

                    <p>Login as {userprofile}</p>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6} md={12}>
                                <Form.Group controlId="pan">
                                    <Form.Label>PAN</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pan"
                                        value={formData.pan}
                                        onChange={handleChange} />
                                </Form.Group>
                                <Form.Group controlId="acno">
                                    <Form.Label>ACNO</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="acno"
                                        value={formData.acno}
                                        onChange={handleChange} />
                                    <p><strong>Titel:</strong> {customerName}</p>

                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="org_branch_code">
                                            <Form.Label>Branch</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="channel"
                                                value={formData.org_branch_code}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Branch</option>
                                                <option value="001">Default</option>

                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="channel">
                                            <Form.Label>Channel</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="channel"
                                                value={formData.channel}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Channel</option>
                                                <option value="Online">Online</option>
                                                <option value="In-Store">In-Store</option>
                                                {/* Add more options as needed */}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group controlId="tr_amt">

                                    <Form.Label>Transaction Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="tr_amt"
                                        value={formData.tr_amt}
                                        onChange={handleChange} />
                                </Form.Group>
                            </Col>

                            <Col lg={6} md={12}>

                                <Form.Group controlId="imageAttachment">
                                    <Form.Label>Image Attachment</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="imageAttachment"
                                        accept=".jpg, .jpeg" // Specify accepted file types
                                        onChange={handleImageChange} />
                                    {formData.attachment && (
                                        <div className='p-3'>

                                            <img
                                                src={formData.attachment}
                                                alt="Image Preview"
                                                style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                        </div>
                                    )}
                                </Form.Group>


                                <Form.Group controlId="txn_date">
                                    <Form.Label>Date of Transaction</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="txn_date"
                                        value={formData.txn_date || ''}
                                        onChange={handleChange} />
                                </Form.Group>

                                <Form.Group controlId="org_id">
                                    <Form.Label>Transaction ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="org_id"
                                        value={formData.org_id || ''}
                                        onChange={handleChange} />
                                </Form.Group>

                                <Form.Group controlId="merchant_name">
                                    <Form.Label>Merchant Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="merchant_name"
                                        value={formData.merchant_name || ''}
                                        onChange={handleChange} />
                                </Form.Group>

                                <Form.Group controlId="merchant_location">
                                    <Form.Label>Merchant Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="merchant_location"
                                        value={formData.merchant_location || ''}
                                        onChange={handleChange} />
                                </Form.Group>


                            </Col>
                        </Row>

                        <Row className='p-5'>
                            <Col className="d-grid gap-2 d-md-flex justify-content-md-end">

                                <CustomButton variant={'primary'} className='mx-2' loading={loading} color={undefined} type="submit" text="Submit" />
                            </Col>
                        </Row>





                    </Form></>}
        </Container>
    );
};

export default DisputeEntry;
