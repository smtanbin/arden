

import React, { useState } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    SelectPicker,
    Input,
    DatePicker,
} from 'rsuite';

import { useAuth } from '../../apps/useAuth';
import useApi from '../../apps/useApi';
import CustomButton from '../../Components/CustomButtons';
import BackIcon from '../../assets/icons/back.svg';
import Success from '../../assets/success.gif';

type Payload = {
    error: string | null;
    uuid: string | null;
};

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

    const [uuid, setUuid] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
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
        maker_user: userprofile,
    });

    const [customerName, setCustomerName] = useState<string>('');

    const handleBack = () => {
        setUuid('');
        setSuccess(false);
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
            maker_user: userprofile,
        });
    };

    const handleChange = (name: string, value: string) => {
        setCustomerName(value);
        setFormData({
            ...formData,
            [name]: value || '',
            pan: name === 'pan' ? value || '' : formData.pan,
            acno: name === 'acno' ? value || '' : formData.acno,
        });
    };

    // const handleImageChange = (file: File) => {
    //     if (file) {
    //         const reader = new FileReader();

    //         reader.onloadend = () => {
    //             const img = new Image();
    //             img.src = reader.result as string;

    //             img.onload = () => {
    //                 const canvas = document.createElement('canvas');
    //                 const ctx = canvas.getContext('2d')!;

    //                 canvas.width = 1200;
    //                 canvas.height = 800;

    //                 ctx.drawImage(img, 0, 0, 1200, 800);

    //                 const resizedImage = canvas.toDataURL('image/jpeg');

    //                 setFormData({
    //                     ...formData,
    //                     attachment: resizedImage,
    //                 });
    //             };
    //         };

    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const payload: Payload = await api.useApi('POST', '/v1/dispute/add', formData);
            if (payload && !payload.error) {
                setUuid(`Dispute added Tracking id ${payload.uuid}`);
                setLoading(false);
                setSuccess(true);
            } else {
                setLoading(false);
                alert(`An error occurred. ${payload ? payload.error : 'Unknown error'}`);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Container>
            {success ? (
                <>
                    <div className="mt-4 p-5 p-center" style={{ color: '#053223' }}>
                        <h1 className="p-5">Add Dispute</h1>
                    </div>
                    <div className="px-4 py-4  text-center">
                        <img src={Success} height="300px" alt="" />
                        <h1 className="display-5 fw-bold">Success</h1>
                        <div className="col-lg-6 mx-auto">
                            <p className="lead mb-4">{uuid}</p>
                            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                                <CustomButton loading={false} variant={'outline'} icon={<img src={BackIcon} height="20px" />} text="Go Back" onClick={handleBack} />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="mt-4 p-5 p-center" style={{ color: '#053223' }}>
                        <h1 className="p-5">Add Dispute</h1>
                    </div>
                    <p>Login as {userprofile}</p>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6} md={12}>
                                <Form.Group controlId="pan">
                                    <Form.Control
                                        type="text"
                                        name="pan"
                                        value={formData.pan}
                                        onChange={(value) => handleChange('pan', value)}
                                        placeholder="PAN"
                                    />
                                </Form.Group>
                                <Form.Group controlId="acno">
                                    <Form.Control
                                        type="text"
                                        name="acno"
                                        value={formData.acno}
                                        onChange={(value) => handleChange('acno', value)}
                                        placeholder="ACNO"
                                    />
                                    <p>
                                        <strong>Titel:</strong> {customerName}
                                    </p>
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="org_branch_code">
                                            <SelectPicker
                                                data={[{ value: '001', label: 'Default' }]}
                                                placeholder="Select Branch"
                                                name="org_branch_code"
                                                value={formData.org_branch_code}
                                                onChange={(value) => handleChange('org_branch_code', value || '')}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Form.Group controlId="channel">
                                        <SelectPicker
                                            data={[
                                                { value: 'Online', label: 'Online' },
                                                { value: 'In-Store', label: 'In-Store' },
                                            ]}
                                            placeholder="Select Channel"
                                            name="channel"
                                            value={formData.channel}
                                            onChange={(value) => handleChange('channel', value)}
                                        />
                                    </Form.Group>
                                </Row>
                            </Col>



                            <Col lg={6} md={12}>
                                {/* <Form.Group controlId="imageAttachment">
                                    <Uploader
                                        fileList={[]}
                                        autoUpload={false}
                                        onChange={(file) => handleImageChange(file[0].blobFile)} action={''}                                    >
                                        <button type="button" className="rs-uploader-trigger-btn">
                                            Upload Image
                                        </button>
                                    </Uploader>
                                    {formData.attachment && (
                                        <div className="p-3">
                                            <img
                                                src={formData.attachment}
                                                alt="Image Preview"
                                                style={{ maxWidth: '100%', maxHeight: '200px' }}
                                            />
                                        </div>
                                    )}
                                </Form.Group> */}
                                <Form.Group controlId="txn_date">
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        name="txn_date"
                                        value={formData.txn_date}
                                        onChange={(value) => handleChange('txn_date', value)}
                                        placeholder="Date of Transaction"
                                    />
                                </Form.Group>
                                <Form.Group controlId="org_id">
                                    <Input
                                        type="text"
                                        name="org_id"
                                        value={formData.org_id}
                                        onChange={(value) => handleChange('org_id', value)}
                                        placeholder="Transaction ID"
                                    />
                                </Form.Group>
                                <Form.Group controlId="merchant_name">
                                    <Input
                                        type="text"
                                        name="merchant_name"
                                        value={formData.merchant_name}
                                        onChange={(value) => handleChange('merchant_name', value)}
                                        placeholder="Merchant Name"
                                    />
                                </Form.Group>
                                <Form.Group controlId="merchant_location">
                                    <Input
                                        type="text"
                                        name="merchant_location"
                                        value={formData.merchant_location}
                                        onChange={(value) => handleChange('merchant_location', value)}
                                        placeholder="Merchant Location"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="p-5">
                            <Col className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <CustomButton variant={'primary'} className="mx-2" loading={loading} color={undefined} type="submit" text="Submit" />
                            </Col>
                        </Row>
                    </Form>
                </>
            )}
        </Container>
    );
};

export default DisputeEntry;
