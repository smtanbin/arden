/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Pagination, ProgressBar } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faClock } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react";
import moment from "moment";
import background from '../../../assets/login/light.svg'


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

type DisputeListTable = {
    data: DisputeData[] | undefined;
    loading: boolean
}



const DisputeListTable: React.FC<DisputeListTable> = ({ data, loading }) => {

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10); // Adjust the number of items per page

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data ? data.slice(indexOfFirstItem, indexOfLastItem) : [];

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            {loading ?
                <ProgressBar animated now={100} />
                :
                data && data.length != 0 ?
                    <><Table hover size="sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>UUID</th>
                                <th>Branch Code</th>
                                <th>Acquirer</th>
                                <th>Account No</th>
                                <th>Clame Amount</th>
                                <th>Raise Date</th>
                                <th>Branch Code</th>
                                <th>BB Dispute ID</th>
                                <th>Status</th>

                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(({ acquirer, uuid, org_branch_code, dispute_amt, acno, timestamp, channel, resolved, bb_dispute_id }: any, index: number) => (
                                <tr key={index}>
                                    <td>{index + 1} </td>
                                    <td>{uuid}</td>
                                    <td>{org_branch_code}</td>
                                    <td>{acquirer}</td>
                                    <td>{acno}</td>
                                    <td>{dispute_amt}</td>
                                    <td>{moment(timestamp).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                    <td>{channel}</td>
                                    <td>{bb_dispute_id}</td>
                                    <td>{resolved ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faClock} />}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table><Pagination>
                            {[...Array(Math.ceil(data?.length / itemsPerPage) || 1)].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination></>
                    : <div className="text-center p-4" style={{ background: `url(${background}) center/cover` }}>
                        <h3>No data found</h3>
                    </div>}
        </div>
    );
};

export default DisputeListTable;
