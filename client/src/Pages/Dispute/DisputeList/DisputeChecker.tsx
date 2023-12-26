

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Placeholder, Form, Col, Container, Divider, FlexboxGrid, Grid, Row, Stack, IconButton } from 'rsuite';

import PageTopIcon from '@rsuite/icons/PageTop';
import useApi from '../../../apps/useApi';
import { useAuth } from '../../../apps/useAuth';
import { useParams } from 'react-router-dom';
import "../../../styles/zoom.css"



type PayloadData = {
    payload: DisputeDataType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
}
type ImgPayloadData = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attachment: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
}


type DisputeDataType = {
    uuid: string;
    pan: string;
    acno: string;
    title: string;
    timestamp: string;
    org_branch_code: string;
    org_id: string;
    txn_date: string;
    tr_amt: string;
    massage: string;
    channel: string;
    complain_date: string;
    acquirer: string;
    terminal_id: string;
    merchant_bank: string;
    merchant_name: string;
    merchant_location: string;
    dispute_amt: string;
    refund_amt: string;
    doc_no: string;
    stan: string;
    maker_user: string | null;
    open_date: string | null;
    resolved: string | null;
    bb_dispute_id: string | null;
    submitted: string | null;
    approved: string | null;
    approvedDate: string | null;
    remark: string | null;
    authorizedUser: string | null;
};

// type FormData = {
//     acquirer: string;
//     terminal_id: string;
//     merchant_bank: string;
//     merchant_name: string;
//     merchant_location: string;
//     tr_amt: string;
//     dispute_amt: string;
//     refund_amt: string;
//     massage: string;
//     channel: string;
//     complain_date: string;
//     doc_no: string;
//     stan: string;
//     attachment: string | null;
//     maker_user: string | null;
//     open_date: string | null;
//     resolved: string | null;
//     bb_dispute_id: string | null;
//     submitted: string | null;
//     approved: string | null;
//     approvedDate: string | null;
//     remark: string | null;
//     authorizedUser: string | null;
// };


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DisputeChecker: React.FC<any> = () => {
    const { param } = useParams<{ param: string }>();

    const [disputeData, setDisputeData] = useState<DisputeDataType>();
    const [image, setImage] = useState<any>(undefined);
    // const [formData, setFormData] = useState<FormData>({
    //     title: '',
    //     timestamp: '',
    //     acquirer: '',
    //     org_branch_code: '',
    //     org_id: '',
    //     txn_date: '',
    //     terminal_id: '',
    //     merchant_name: '',
    //     merchant_location: '',
    //     tr_amt: '',
    //     dispute_amt: '',
    //     refund_amt: '',
    //     massage: '',
    //     channel: '',
    //     complain_date: '',
    //     doc_no: '',
    //     stan: '',
    //     attachment: null,
    //     maker_user: null,
    //     open_date: null,
    //     resolved: null,
    //     bb_dispute_id: null,
    //     submitted: null,
    //     approved: null,
    //     approvedDate: null,
    //     remark: null,
    //     authorizedUser: null,
    // });

    // const data: DataParam = param
    const auth = useAuth();
    const api = new useApi(auth);
    // const userprofile: string = auth.token?.username




    const fatchData = async () => {

        try {
            const respnse = await api.useApi('GET', `/v1/dispute/get/${param}`)

            const res: PayloadData = respnse.data

            if (res && !res.error) {
                setDisputeData(res.payload);

            } else {
                alert("An error occurred. " + (res ? res.error : "Unknown error"));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("An error occurred. " + error);
        }

    };

    const fatchImageData = async () => {

        try {
            const response = await api.useApi('GET', `/v1/dispute/get_image/${param}`)

            const res: ImgPayloadData = response.data


            if (res && !res.error) {

                res.attachment ? setImage(atob(res.attachment)) : setImage(undefined)

            } else {
                alert("An error occurred. " + (res ? res.error : "Unknown error"));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("An error occurred. " + error);
        }

    };





    useEffect(() => {
        fatchData().then(() => {
            fatchImageData();
        })
    }, []);






    return (
        <Container>

            <Form style={{ padding: '3%' }} onSubmit={() => console.log("t")}>
                <Grid fluid >
                    <Row className="p-5">
                        <FlexboxGrid>
                            <FlexboxGrid.Item as={Col} colspan={24} md={21}>
                                <Link to={"/disputeList"}>
                                    <IconButton icon={<PageTopIcon />}>Back</IconButton>
                                </Link>
                                <h3 className="p-5">Dispute Checker</h3>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item as={Col} colspan={24} md={3}>
                                <br />
                                <Button style={{ width: '100%' }} size="lg" type="submit" color="green" appearance="primary">Save</Button>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Row>
                    <Divider />
                    <h6>Disput ID: {disputeData?.uuid}</h6>
                    <Divider />
                </Grid>
                <Grid fluid>
                    <Row className="show-grid">
                        <Col sm={24} md={8} style={{ margin: "15px 0" }}>
                            <Stack direction={"column"} alignItems="flex-start" spacing={2}>
                                <span><strong>Open Date :</strong>{disputeData?.timestamp}</span>
                                <span><strong>Account Number :</strong>{disputeData?.acno}</span>
                                <span><strong>Account Titel :</strong>{disputeData?.title}</span>
                                <span><strong>Card Number :</strong>{disputeData?.pan}</span>
                                <span><strong>Branch :</strong>{disputeData?.org_branch_code}</span>
                                <span><strong>Channel :</strong>{disputeData?.channel}</span>
                                <span><strong>Maker :</strong>{disputeData?.maker_user}</span>
                            </Stack>
                        </Col>
                        <Col sm={24} md={8} style={{ margin: "15px 0" }}>
                            <Stack direction={"column"} alignItems="flex-start" spacing={2}>
                                <span><strong>Transaction  Date :</strong>{disputeData?.txn_date}</span>
                                <span><strong>Transaction  ID :</strong>{disputeData?.org_id}</span>
                                <span><strong>Clame Amount :</strong>{disputeData?.tr_amt}</span>
                                <span><strong>Merchant  Bank:</strong>{disputeData?.merchant_bank}</span>
                                <span><strong>Merchant  Name:</strong>{disputeData?.merchant_name}</span>
                                <span><strong>Merchant  Location:</strong>{disputeData?.merchant_location}</span>
                            </Stack>
                        </Col>
                        <Col sm={24} md={8} style={{ margin: "15px 0" }}>
                            <Stack direction="column" alignItems="flex-start" spacing={6}>
                                {image ?

                                    <img
                                        src={`data:image/jpeg;base64,${image || ''}`}
                                        alt="Image Preview"
                                        className="zoom-image"
                                        width={"100%"}
                                    />

                                    : <Placeholder.Paragraph style={{ marginTop: 30 }} rows={5} graph="image" />}
                            </Stack>
                        </Col>
                    </Row>
                </Grid>
                <Divider />

            </Form>
        </Container>
    );
};





export default DisputeChecker;


