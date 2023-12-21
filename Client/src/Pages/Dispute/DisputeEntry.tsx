

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import isAfter from 'date-fns/isAfter';

import {
    Grid,
    Container,
    Row,
    Col,
    Form,
    SelectPicker,

    FlexboxGrid,
    Divider,
    Button,
    DatePicker,
    Stack,
    IconButton,
    Message,
    Input,

} from 'rsuite';

import { useAuth } from '../../apps/useAuth';
import useApi from '../../apps/useApi';

import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import Success from '../../assets/success.gif';

type Payload = {
    error: string | null;
    uuid: string | null;
};


interface BranchItem {
    label: string;
    value: string;
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
    massage: string;
    channel: string;
    attachment: string | null;
    maker_user: string | null;
};


const DisputeEntry: React.FC<{ userprofile?: string }> = () => {
    const auth = useAuth();
    const api = new useApi(auth);
    const userprofile: string = auth.token?.username || 'guest';


    const [uuid, setUuid] = useState<string>('');
    const [branch, setBranch] = useState<BranchItem[]>([{ label: 'Select Branch', value: '' }]);
    const [acquirers, setAcquirers] = useState<BranchItem[]>([{ label: 'Select Acquirer', value: '' }]);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [panError, setPanError] = useState<boolean>(false);
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
        massage: '',
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
            massage: '',
            channel: '',
            attachment: null,
            maker_user: userprofile,
        });
    };


    const fatchBranch = useCallback(async () => {
        try {
            const response = await fetch('http://10.140.6.65:4000/api/v1/oauth/branchs', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!data.error) {
                const selectData = data.payload.map(({ CODE, NAME }: { CODE: string; NAME: string }) => ({
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
    }, []);

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

    const fatchAcquirers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://10.140.6.65:4000/api/v1/dispute/acquirers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!data.error) {
                const selectData = data.payload.map((acquirer: string, index: number) => ({
                    label: acquirer,
                    value: `${acquirer}-${index}`,
                }));
                setAcquirers(selectData);
            } else {
                setAcquirers([{ label: 'Select Acquirer', value: '' }]);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
            setAcquirers([{ label: 'Select Acquirer', value: '' }]);
        }
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetchAccountTitle = useCallback(async (value: any) => {
        setLoading(true);
        try {
            const data = await api.useApi('GET', `/v1/cbs/account_info/${value}`);

            if (!data.error && data.payload && data.payload.length !== 0) {
                setCustomerName(data.payload[0].ACCOUNTTITLE);
                handleChange('org_branch_code', data.payload[0].BRANCHCODE);
            } else if (!data.error && data.payload && data.payload.length === 0) {
                setCustomerName("Account not found");
            } else if (data.error) {
                setError(data.error);
            } else {
                setError("Unknown Error");
            }
            setLoading(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setLoading(false);
            setError(error.message);
            console.log('Error fetching account title:', error.message);
        }
    }, []);


    const handleChange = (name: string, value: string | null) => {
        setError(undefined);
        setPanError(false)

        if (name === 'acno' && value !== null && value.length >= 11) {
            fetchAccountTitle(value);
        }

        // Validate PAN
        if (name === 'pan' && value !== null) {
            const trimmedPan = value.replace(/\s/g, ''); // Remove spaces
            const isValidPan = /^\d{16}$/.test(trimmedPan) && isLuhnValid(trimmedPan);

            if (!isValidPan) {
                setPanError(true)

                return;
            }
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value || '',
            pan: name === 'pan' ? value || '' : prevData.pan,
            acno: name === 'acno' ? value || '' : prevData.acno,
        }));
    };


    const handelDate = (value: Date | null) => {

        if (value) {
            handleChange('txn_date', moment(value).format("YYYY-MM-DD"));
        }
    }

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


    useEffect(() => {
        fatchBranch()
        fatchAcquirers()
    }, [])


    const memoizedAcquirers = useMemo(() => acquirers, [acquirers]);
    const memoizedBranches = useMemo(() => branch, [branch]);
    return (
        <Container>

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
                                    <h3 className="p-5">Dispute Maker</h3>
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
                            <Col sm={24} md={8} style={{ margin: "15px 0" }}>
                                <Stack direction="column" alignItems="flex-start" spacing={6}>
                                    <Form.Group controlId="pan">
                                        <Form.ControlLabel>Card Number <span style={{ color: 'purple' }}>*</span></Form.ControlLabel>
                                        <Form.Control
                                            type="text"
                                            name="pan"
                                            // value={formData.pan}
                                            onChange={(value) => handleChange('pan', value)}
                                            placeholder="PAN"
                                        />
                                        <Form.ErrorMessage show={panError}>Invalid PAN. Please enter a valid 16-digit PAN.</Form.ErrorMessage>
                                    </Form.Group>

                                    <Form.Group controlId="acno">
                                        <Form.ControlLabel>Account Number <span style={{ color: 'purple' }}>*</span></Form.ControlLabel>
                                        <Form.Control
                                            type="text"
                                            name="acno"
                                            value={formData.acno}
                                            onChange={(value) => handleChange('acno', value)}
                                            placeholder="ACNO"
                                        />
                                        <Form.ErrorMessage show={customerName === "Account Not found" ? true : false
                                        }>{customerName}</Form.ErrorMessage>
                                    </Form.Group>
                                    <Form.Group controlId="titel">
                                        <Form.ControlLabel>Account Titel</Form.ControlLabel>
                                        <Form.Control
                                            type="text"
                                            name="titel"
                                            value={customerName}
                                            disabled={true}
                                            placeholder="Titel"
                                        />

                                    </Form.Group>
                                    {/* Account not found */}
                                    <Stack direction="row" alignItems="flex-start" spacing={6}>
                                        <Form.Group controlId="org_branch_code" >
                                            <Form.ControlLabel>Branch <span style={{ color: 'red' }}>*</span></Form.ControlLabel>
                                            <SelectPicker
                                                data={memoizedBranches}
                                                placeholder="Select Branch"
                                                name="org_branch_code"
                                                value={formData.org_branch_code || '100'}
                                                onChange={(value) => handleChange('org_branch_code', value || '')}
                                            />


                                        </Form.Group>

                                        <Form.Group controlId="channel">
                                            <Form.ControlLabel>Channel <span style={{ color: 'red' }}>*</span></Form.ControlLabel>
                                            <SelectPicker
                                                data={[
                                                    { value: 'default', label: 'Default' },
                                                    { value: 'ATM', label: 'ATM' },
                                                    { value: 'E-COMMERCE', label: 'E-commerce ' },
                                                    { value: 'POS', label: 'POS' },
                                                    { value: 'IBEFTN', label: 'IBEFTN' },
                                                    { value: 'RTGS', label: 'RTGS' },
                                                    { value: 'BFTEN', label: 'BFTEN' },
                                                    { value: 'BFTEN', label: 'BFTEN' },
                                                    { value: 'MFS', label: 'MFS' },
                                                    { value: 'PSP', label: 'P2P' },
                                                ]}
                                                placeholder="Select Channel"
                                                name="channel"
                                                value={formData.channel || 'default'}
                                                onChange={(value) => handleChange('channel', value || '')}
                                            />
                                        </Form.Group>
                                    </Stack>
                                </Stack>
                            </Col>

                            <Col sm={24} md={8} style={{ margin: "15px 0" }}>
                                <Stack direction="column" alignItems="flex-start" spacing={6}>
                                    <Form.ControlLabel>
                                        Transaction Date
                                        <span style={{ color: 'red' }}>*</span>
                                    </Form.ControlLabel>
                                    <Form.Group controlId="txn_date">
                                        <DatePicker shouldDisableDate={date => isAfter(date, new Date())} format="MM/dd/yyyy" ranges={[]} onChange={handelDate} block />
                                    </Form.Group>
                                    <Form.ControlLabel>
                                        Transaction ID
                                        <Form.HelpText tooltip>Any ID help idenfy the dispute.</Form.HelpText>
                                    </Form.ControlLabel>
                                    <Form.Group controlId="org_id">
                                        <Input
                                            type="text"
                                            name="org_id"
                                            value={formData.org_id}
                                            onChange={(value) => handleChange('org_id', value)}
                                            placeholder="Transaction ID"
                                        />
                                    </Form.Group>
                                    <Form.ControlLabel>
                                        Amount
                                        <span style={{ color: 'red' }}>*</span>
                                    </Form.ControlLabel>
                                    <Form.Group controlId="tr_amt">
                                        <Input
                                            type="number"
                                            name="tr_amt"
                                            value={formData.tr_amt}
                                            onChange={(value) => handleChange('tr_amt', value)}
                                            placeholder="Transaction Amount"
                                        />
                                    </Form.Group>
                                    <Form.ControlLabel>Massage</Form.ControlLabel>
                                    <Form.Group controlId="massage">
                                        <Input
                                            placeholder="Massage"
                                            as="textarea" rows={3}
                                            name="massage"
                                            value={formData.massage}
                                            onChange={(value) => handleChange('massage', value || '')}
                                        />
                                    </Form.Group>
                                </Stack>
                            </Col>

                            <Col sm={24} md={8} style={{ margin: "15px 0" }}>
                                <Stack direction={"column"} alignItems="flex-start" spacing={2}>
                                    <Form.ControlLabel>Acquirer</Form.ControlLabel>
                                    <Form.Group controlId="acquirer">
                                        <SelectPicker
                                            data={memoizedAcquirers}
                                            placeholder="Acquirer"
                                            name="acquirer"
                                            value={formData.acquirer || '100'}
                                            onChange={(value) => handleChange('acquirer', value || '')}
                                        />
                                    </Form.Group>
                                    <Form.ControlLabel>Merchant Name</Form.ControlLabel>
                                    <Form.Group controlId="merchant_name">
                                        <Input
                                            type="text"
                                            name="merchant_name"
                                            value={formData.merchant_name}
                                            onChange={(value) => handleChange('merchant_name', value)}
                                            placeholder="Merchant Name"
                                        />
                                    </Form.Group>
                                    <Form.ControlLabel>Merchant Location</Form.ControlLabel>
                                    <Form.Group controlId="merchant_location">
                                        <Input
                                            type="text"
                                            name="merchant_location"
                                            value={formData.merchant_location}
                                            onChange={(value) => handleChange('merchant_location', value)}
                                            placeholder="Merchant Location"
                                        />
                                    </Form.Group>
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
                                </Stack>
                                {formData.attachment && (
                                    <div className='p-3'>
                                        <img
                                            src={formData.attachment}
                                            alt="Image Preview"
                                            style={{ maxWidth: '100%', maxHeight: '200px' }}
                                        />
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </Grid>
                </Form>





            )
            }
        </Container >
    );
};





export default DisputeEntry;


