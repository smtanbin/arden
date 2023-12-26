import { Button, Container, DateRangePicker, Dropdown, Stack } from 'rsuite'

import { useState, useEffect } from 'react';

import { useAuth } from '../../../apps/useAuth';
import useApi from '../../../apps/useApi';
import DisputeListTable from './DisputeListTable';

interface Payload {
    error: string | null;
    payload: DisputeData[] | null;
}


export interface DisputeData {
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
    merchant_bank: string | null;
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
    const [approvedData, setApprovedData] = useState<boolean>(true);

    const auth = useAuth();
    const api = new useApi(auth);


    const approvedDataOptions = [
        { value: true, label: 'Approved' },
        { value: false, label: 'Pending' },
    ];

    const fetchDefaultData = async () => {
        try {
            const res = await api.useApi('GET', `/v1/dispute/dispute_list/${auth.username}`)

            const payload: Payload = res.data

            if (payload && !payload.error) {
                setData(payload.payload || []);
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
            const res = await api.useApi('POST', `/v1/dispute/list_by_date`, {
                from_date: dateRange[0]?.toISOString().split('T')[0] || '',
                to_date: dateRange[1]?.toISOString().split('T')[0] || '',
            })


            const payload: Payload = res.data

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


    // Handel Functions 

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


    const handleApprovedDataChange = (value: boolean) => {
        setApprovedData(value);
    }

    useEffect(() => {
        fetchDefaultData();
    }, []);

    return (
        <Container>

            <Stack style={{
                width: "100%", padding: "3%"
            }}
                direction="column" alignItems="center" spacing={6}>
                <h2 className='p-5'>Dispute List</h2>
                <hr />
                <Stack direction="row" alignItems="center" spacing={6}>
                    <DateRangePicker disabled
                        value={dateRange.length === 0 ? null : dateRange
                        }
                        onChange={handleDateRangeChange}
                    />

                    <Button color="blue" disabled appearance="primary" onClick={handleGenerate}>
                        Generate
                    </Button>
                    <Button appearance="ghost" disabled onClick={handleReset}>
                        Reset
                    </Button>

                    <Button color="blue" appearance="default" onClick={handleRefresh}>
                        Refresh
                    </Button>
                    <Dropdown
                        title={approvedData ? 'Approved' : 'Pending'}
                        activeKey={approvedData}
                        onSelect={handleApprovedDataChange}
                    >
                        {approvedDataOptions.map(option => (
                            <Dropdown.Item key={option.value} eventKey={option.value}>
                                {option.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown>
                </Stack>
            </Stack>
            <div style={{ padding: "1%" }}>

                {data ? <DisputeListTable data={[data, loading, approvedData]} /> : <></>}
            </div>

        </Container >
    );
};

export default DisputeList;
