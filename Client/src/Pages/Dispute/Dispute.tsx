import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Col, Container, Form, Row, Button } from 'react-bootstrap';
import axios from 'axios';

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
};

const Dispute: React.FC<{ userprofile?: string }> = ({ userprofile = 'tanbin' }) => {
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
    });

    const [customerName, setCustomerName] = useState<string>("")

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
                setFormData({
                    ...formData,
                    attachment: reader.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('your_api_endpoint', formData);
            console.log(response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Container>
            <h1>Posting Data to Test URL</h1>
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
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="acno">
                            <Form.Label>ACNO</Form.Label>
                            <Form.Control
                                type="text"
                                name="acno"
                                value={formData.acno}
                                onChange={handleChange}
                            />
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

                                        {/* Add more options as needed */}
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
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col lg={6} md={12}>

                        <Form.Group controlId="imageAttachment">
                            <Form.Label>Image Attachment</Form.Label>
                            <Form.Control
                                type="file"
                                name="imageAttachment"
                                onChange={handleImageChange}
                            />
                            {formData.attachment && (
                                <div className='p-3'>

                                    <img
                                        src={formData.attachment}
                                        alt="Image Preview"
                                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                                    />
                                </div>
                            )}
                        </Form.Group>


                        <Form.Group controlId="txn_date">
                            <Form.Label>Date of Transaction</Form.Label>
                            <Form.Control
                                type="date"
                                name="txn_date"
                                value={formData.txn_date || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="org_id">
                            <Form.Label>Transaction ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="org_id"
                                value={formData.org_id || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="merchant_name">
                            <Form.Label>Merchant Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="merchant_name"
                                value={formData.merchant_name || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="merchant_location">
                            <Form.Label>Merchant Location</Form.Label>
                            <Form.Control
                                type="text"
                                name="merchant_location"
                                value={formData.merchant_location || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>


                    </Col>
                </Row>

                <Row className='p-3 m-3'>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Row>





            </Form>
        </Container>
    );
};

export default Dispute;
