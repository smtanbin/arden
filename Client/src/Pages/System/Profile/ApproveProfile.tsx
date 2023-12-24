import { useEffect, useState } from "react";
import { Button, Container, Message, Modal, Panel, Table } from 'rsuite'

import { useAuth } from "../../../apps/useAuth";
import Api from "../../../apps/useApi";
import moment from "moment";

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

    const auth = useAuth()
    const api = new Api(auth)

    const handleOpen = (rowData: rowData) => {
        setModelData(rowData)
    }

    const handleClose = () => setModelData(undefined);

    const handleActiveAccount = async (uuid: string) => {
        const res: payload = await api.useApi('PUT', `/users/pendingList/${uuid}`)
        !res.error ? setData(res.payload) : null
        setLoading(false)
        setModelData(undefined)

    }

    const handleRejectAccount = async (uuid: string) => {
        const res: payload = await api.useApi('DELETE', `/users/pendingList/${uuid}`)
        !res.error ? setData(res.payload) : null
        setLoading(false)
        setModelData(undefined)

    }

    const formatRegDate = (dateString: string) => {
        return moment(dateString).format('MMM DD, YYYY HH:mm'); // Adjust the format as needed
    };

    const fetchTableData = async () => {
        setLoading(true)
        const res: payload = await api.useApi('GET', '/users/pendingList')
        !res.error ? setData(res.payload) : setError(res.error)
        setLoading(false)
    }

    useEffect(() => {
        fetchTableData()
    }, [])


    return (
        <Container>
            <Panel header={<h3>Profile List</h3>} >
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
        </Container>
    )
}
