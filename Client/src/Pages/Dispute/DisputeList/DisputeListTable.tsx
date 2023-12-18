import { Table, Pagination } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;
import { useState } from "react";

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

type DisputeListTableProps = {
    payload: DisputeData[] | undefined;
    loading: boolean;
};

const DisputeListTable: React.FC<DisputeListTableProps> = ({ payload, loading }) => {
    const [limit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination logic
    const indexOfLastItem = currentPage * limit;
    const indexOfFirstItem = indexOfLastItem - limit;
    const currentItems = payload ? payload.slice(indexOfFirstItem, indexOfLastItem) : [];

    const totalPages = payload ? Math.ceil(payload.length / limit) : 1;

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <Table
                height={420}
                data={currentItems}
                loading={loading}
                autoHeight
                affixHeader
                affixHorizontalScrollbar
            >
                <Column width={50} align="center" fixed>
                    <HeaderCell>Id</HeaderCell>
                    <Cell dataKey="id" />
                </Column>

                <Column width={100} fixed>
                    <HeaderCell>First Name</HeaderCell>
                    <Cell dataKey="firstName" />
                </Column>
            </Table>

            <Pagination
                prev
                last
                next
                first
                size="md"
                pages={totalPages}
                activePage={currentPage}
                onSelect={(pageNumber: number) => paginate(pageNumber)}
            />

        </div>
    );
};

export default DisputeListTable;
