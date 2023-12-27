import { useEffect, useState } from "react";
import { Button, Col, FlexboxGrid, Message, Modal, Panel, Row, Table } from 'rsuite'

import { useAuth } from "../../../apps/useAuth";
import Api from "../../../apps/useApi";
import moment from "moment";
import { Link } from "react-router-dom";

const { Column, HeaderCell, Cell } = Table;

type rowData = {
    'firstName': string,
    'lastName': string,
    'phone': string,
    'reg_date': string,
    'user_id': string,
    'username': string,
    'uuid': string,
}

interface payload {
    'payload': rowData[],
    'error': string | undefined
}

export default function ApproveProfile() {

    const [data, setData] = useState<rowData[]>([])
    const [error, setError] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(false)
    const [modelData, setModelData] = useState<rowData | undefined>(undefined)
    const [pathlist, setPathList] = useState<string[] | undefined>(undefined);


    const auth = useAuth()
    const api = new Api(auth)

    const handleOpen = (rowData: rowData) => {
        setModelData(rowData)
    }

    const handleClose = () => setModelData(undefined);

    const handleActiveAccount = async (uuid: string) => {
        const res = await api.useApi('PUT', `/users/pendingList/${uuid}`)

        const payload: payload = res.data
        !payload.error ? setData(payload.payload) : null
        setLoading(false)
        setModelData(undefined)

    }

    const handleRejectAccount = async (uuid: string) => {
        const res = await api.useApi('DELETE', `/users/pendingList/${uuid}`)
        const payload: payload = res.data

        !payload.error ? setData(payload.payload) : null
        setLoading(false)
        setModelData(undefined)

    }

    const formatRegDate = (dateString: string) => {
        return moment(dateString).format('MMM DD, YYYY HH:mm'); // Adjust the format as needed
    };

    const fetchTableData = async () => {
        setLoading(true)
        const res = await api.useApi('GET', '/users/pendingList')
        const payload: payload = res.data
        !payload.error ? setData(payload.payload) : setError(payload.error)
        setLoading(false)
    }

    const fatchRight = async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = await api.useApi('GET', `/users/permission/${auth.username}`);
            setPathList(data.data)



        } catch (error) {
            // Handle error, e.g., redirect to an error page
            alert(`Error fetching rights: ${error}`);
            setPathList([]);
        }
    }


    useEffect(() => {
        fatchRight();
        fetchTableData()
    }, [])


    return (
        <>
            <Panel header={<Row className="p-5">
                <FlexboxGrid>
                    <FlexboxGrid.Item as={Col} colspan={24} md={21}>
                        <h3 className="p-5">Pending User List</h3>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item as={Col} colspan={24} md={3}>
                        <br />
                        {pathlist && (pathlist.includes('prime') || pathlist.includes('adduser')) ? (
                            <Link to={"/addUser"}><Button style={{ width: '100%' }} size="lg" type="submit" color="green" appearance="primary">Add User</Button></Link>)
                            : (
                                <></>
                            )}
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </Row>}>

                {error ? <Message showIcon type="warning">{error}</Message> : <></>}
                <Modal open={modelData ? true : false} onClose={handleClose} backdrop={'static'}>
                    <Modal.Header>
                        <Modal.Title>Action</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        What you like to do with {modelData?.firstName} {modelData?.lastName} request?
                    </Modal.Body>
                    <Modal.Footer>

                        {modelData ?
                            <>
                                <Button color="red" onClick={() => handleRejectAccount(modelData.uuid.toString())} appearance="primary">Reject
                                </Button>
                                <Button color="green" onClick={() => handleActiveAccount(modelData.uuid.toString())} appearance="primary">Approve
                                </Button>
                            </>
                            : <Button onClick={handleClose} appearance="ghost">
                                Close
                            </Button>}
                    </Modal.Footer>
                </Modal>

                <Table
                    wordWrap="break-word"
                    loading={loading}
                    autoHeight
                    bordered
                    data={data}
                    onRowClick={rowData => {
                        handleOpen(rowData)
                    }}>

                    <Column flexGrow={1}>
                        <HeaderCell>Employee ID</HeaderCell>
                        <Cell dataKey="user_id" />
                    </Column>

                    <Column flexGrow={1}>
                        <HeaderCell>Formatted Reg Date</HeaderCell>
                        <Cell>
                            {data.length != 0 ? (rowData) => formatRegDate(rowData.reg_date) : ''}
                        </Cell>
                    </Column>

                    <Column flexGrow={1}>
                        <HeaderCell>First Name</HeaderCell>
                        <Cell dataKey="firstName" />
                    </Column>

                    <Column flexGrow={1}>
                        <HeaderCell>Last Name</HeaderCell>
                        <Cell dataKey="lastName" />
                    </Column>

                    <Column flexGrow={1}>
                        <HeaderCell>Email</HeaderCell>
                        <Cell dataKey="username" />
                    </Column>

                    <Column flexGrow={1}>
                        <HeaderCell>Phone</HeaderCell>
                        <Cell dataKey="phone" />
                    </Column>

                </Table>
            </Panel>
        </>
    )
}
