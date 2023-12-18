import { Button, Container, Row, Col, DateRangePicker } from 'rsuite'

import { useState, useEffect } from 'react';

import { useAuth } from '../../../apps/useAuth';
import useApi from '../../../apps/useApi';
import DisputeListTable from './DisputeListTable';

interface Payload {
    error: string | null;
    payload: DisputeData[] | null;
}


interface DisputeData {
    acno: string;
    acquirer: string | null;
    approved: string | null;
    approvedDate: string | null;
    attachment: string | null;
    authorizedUser: string | null;
    bb_dispute_id: string | null;
    channel: string;
    complain_date: string | null;
    dispute_amt: string | null;
    doc_no: string | null;
    maker_user: string;
    massage: string | null;
    merchant_location: string | null;
    merchant_name: string | null;
    open_date: string | null;
    org_branch_code: string;
    org_id: string;
    pan: string | null;
    refund_amt: string | null;
    remark: string | null;
    resolved: string | null;
    stan: string | null;
    submitted: string | null;
    terminal_id: string | null;
    timestamp: string;
    title: string | null;
    tr_amt: string;
    txn_date: string;
    uuid: string;
}

const DisputeList = () => {
    const [data, setData] = useState<DisputeData[] | undefined>(undefined);
    const [dateRange, setDateRange] = useState<[Date, Date] | []>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [defaultRefrash, setDefaultRefrash] = useState<boolean>(true);

    const auth = useAuth();
    const api = new useApi(auth);

    const fetchDefaultData = async () => {
        try {
            const res: Payload = await api.useApi('GET', '/v1/dispute/dispute_list');
            if (res && !res.error) {
                setData(res.payload || []);
            } else {
                alert("An error occurred. " + (res ? res.error : "Unknown error"));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("An error occurred. " + error);
        }
        setLoading(false);
    };

    const fetchDataByDate = async () => {
        setDefaultRefrash(false);
        try {
            const payload: Payload = await api.useApi('POST', '/v1/dispute/list_by_date', {
                from_date: dateRange[0]?.toISOString().split('T')[0] || '',
                to_date: dateRange[1]?.toISOString().split('T')[0] || '',
            });
            if (payload && !payload.error) {
                setData(payload.payload || []);
            } else {
                alert("An error occurred. " + (payload ? payload.error : "Unknown error"));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("An error occurred. " + error);
        }
        setLoading(false);
    };

    const handleDateRangeChange = (value: [Date, Date] | []) => {
        setDateRange(value);
    };

    const handleRefresh = () => {
        setLoading(true);
        defaultRefrash ? fetchDefaultData() : fetchDataByDate();
    };

    const handleGenerate = () => {
        fetchDataByDate();
    };

    const handleReset = () => {
        fetchDefaultData();
        setDateRange([]);
    };

    useEffect(() => {
        fetchDefaultData();
    }, []);

    return (
        <Container>
            <div className='mt-4 p-5 p-center' style={{ color: '#053223' }}>
                <h1 className='p-5'>Dispute List</h1>
                <Row className="mb-3">
                    <Col md={4}>

                        <DateRangePicker
                            value={dateRange.length === 0 ? null : dateRange}
                            onChange={handleDateRangeChange}
                        />
                    </Col>
                </Row>
                <div className="d-flex">
                    <Button color="blue" appearance="primary" onClick={handleGenerate}>
                        Generate
                    </Button>
                    <Button color="blue" appearance="ghost" className="mx-2" onClick={handleRefresh}>
                        Refresh
                    </Button>
                    <Button color="blue" appearance="ghost" className="mx-2" onClick={handleReset}>
                        Reset
                    </Button>
                </div>
            </div>
            <DisputeListTable data={data} loading={loading} />
        </Container>
    );
};

export default DisputeList;
