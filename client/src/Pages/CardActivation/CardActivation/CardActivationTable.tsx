import { Stack, Table } from 'rsuite';

import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type DisputeData = {
    acno: string;
    channel: string;
    complain_date: string | null;
    dispute_amt: string | null;
    open_date: string | null;
    org_id: string;
    pan: string | null;
    timestamp: string;
    title: string | null;
    tr_amt: string;
    txn_date: string;
    uuid: string;
};

type DisputeListTableProps = {
    data: [DisputeData[] | null | undefined, boolean, boolean];
};

const keyOrder = [
    'uuid',
    'issue_branch_code',
    'acno',
    'channel',
    'timestamp',
    'tr_amt',
    'open_date',
    'org_id',
    'pan',
    'title',
    'dispute_amt',
    'txn_date',
];
const appKeyOrder = [
    'uuid',
    'issue_branch_code',
    'acno',
    'channel',
    'timestamp',
    'tr_amt',
    'open_date',
    'org_id',
    'pan',
    'title',
    'dispute_amt',
    'txn_date',
];

const CardActivationTable: React.FC<DisputeListTableProps> = ({ data }) => {
    const { Column, HeaderCell, Cell } = Table;
    const [headerCells, setHeaderCells] = useState<ReactNode[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const newHeaderCells = data[2]
            ? keyOrder.map((key) => (
                <Column key={key} width={100} fixed>
                    <HeaderCell>{key.replace('_', ' ')}</HeaderCell>
                    <Cell

                        dataKey={key as keyof DisputeData}
                    />
                </Column>
            ))
            : appKeyOrder.map((key) => (
                <Column key={key} width={100} fixed>
                    <HeaderCell>{key}</HeaderCell>
                    <Cell

                        dataKey={key as keyof DisputeData}

                    />
                </Column>
            ));
        setHeaderCells(newHeaderCells);
    }, [data])

    const handleRowClick = (rowData: DisputeData) => {

        navigate(`/dispute_checker/${rowData.uuid}`);
    };

    return (
        <div style={{ padding: '15px' }}>
            <Stack direction='row' alignItems="flex-start">
                {!data[2] ? <p>Approved List</p> : <p>Pending List</p>}
            </Stack>
            <hr />
            <Table
                style={{ padding: '15px' }}
                autoHeight
                data={data[0] || []} loading={data[1]}
                onRowClick={rowData => {
                    handleRowClick(rowData);
                }}
            >
                {headerCells}
            </Table>
        </div>
    );
};

export default CardActivationTable;
