import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Avatar, Modal, Button, Toggle } from 'rsuite';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import CogIcon from '@rsuite/icons/legacy/Cog';
import { faCreditCard, faMoneyBills, faBook } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../apps/useAuth';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/arden_logo.svg';
import { useTheme } from '../Context/TheamProvider';
import Api from '../apps/useApi';








const AppNavbar: React.FC = () => {

    const auth = useAuth();
    const api = new Api(auth);
    const navigate = useNavigate();


    const { theme, setMode } = useTheme();
    const username: string = auth.token?.username || 'guest';

    const [open, setOpen] = useState(false);
    const [pathlist, setPathList] = useState<string[] | undefined>(undefined);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    useEffect(() => {
        const fatch = async () => {
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

        fatch();
    }, [])



    const logout = async () => {

        const data: { username: string; refreshToken: string } = {
            username: username || '', // Assuming you have a valid username in your auth context
            refreshToken: auth.token?.refreshToken || '',
        };

        try {
            const response = await api.useApi('POST', `/v1/oauth/logout`, data,);


            if (response.status === 200) {
                auth.logout(); // Assuming you have a logout method in your useAuth hook
                setOpen(false)// Close the modal after successful logout
                navigate("/login", { replace: true });
            } else {
                console.error("Logout failed:", response.status, response.data.statusText);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Logout failed:", error.message);
        } finally {
            setOpen(false)
        }
    };




    return (

        <>
            {/* <Navbar style={{ backgroundColor: "#EFFFE8" }}> */}
            <Navbar>

                <Navbar.Brand href="/">{<img src={logo} style={{ maxHeight: '120%', width: 'auto' }} />}</Navbar.Brand>
                <Nav>

                    <Nav.Menu icon={<FontAwesomeIcon icon={faMoneyBills} />} title="ATM">
                        <Nav.Item>ATM Monitor</Nav.Item>
                        <Nav.Item>Downtime</Nav.Item>
                        <Nav.Item>Extra Cash</Nav.Item>
                    </Nav.Menu>
                    <Nav.Menu icon={<FontAwesomeIcon icon={faCreditCard} />} title="Cards">
                        <Nav.Item>Production List</Nav.Item>
                    </Nav.Menu>
                    {pathlist && (pathlist.includes('prime') || pathlist.includes('adddispute') || pathlist.includes('disputelist')) ?

                        (<Nav.Menu icon={<FontAwesomeIcon icon={faBook} />} title="Dispute">
                            {pathlist && (pathlist.includes('prime') || pathlist.includes('adddispute')) ? (
                                <Link to={"/addDispute"}><Nav.Item>Add Dispute</Nav.Item></Link>
                            ) : <></>}
                            {pathlist && (pathlist.includes('prime') || pathlist.includes('disputelist')) ? (
                                <Link to={"/disputeList"}><Nav.Item>Dispute list</Nav.Item></Link>
                            ) : <></>}
                        </Nav.Menu>)
                        : <></>}


                    <Nav.Menu icon={<CogIcon />} title="Admin">
                        {pathlist && (pathlist.includes('prime') || pathlist.includes('approveprofile')) ? (

                            <Link to={"/approveProfile"}><Nav.Item>Pending User</Nav.Item></Link>
                        ) : <></>}
                        {pathlist && (pathlist.includes('prime') || pathlist.includes('adduser')) ? (

                            <Link to={"/addUser"}><Nav.Item>Add User</Nav.Item></Link>
                        ) : <></>}
                    </Nav.Menu>
                    {/* <Nav.Item icon={<CogIcon />}>Settings</Nav.Item> */}
                </Nav>
                <Nav style={{ marginLeft: 'auto' }} pullRight>
                    <Nav.Menu title={<Avatar circle>
                        {username.slice(0, 2).toUpperCase()}
                    </Avatar>}>
                        <Nav.Item>Profile</Nav.Item>
                        <Nav.Item onClick={handleOpen}>Logout</Nav.Item>
                    </Nav.Menu>
                    <Nav.Item onClick={setMode}>
                        <Toggle
                            arial-label="Switch"
                            checked={theme !== 'light' ? true : false}
                            size="lg"

                            unCheckedChildren={<FontAwesomeIcon icon={faSun} />}
                            checkedChildren={<FontAwesomeIcon icon={faMoon} />}
                        />
                    </Nav.Item>
                </Nav>

            </Navbar>
            <Modal role="alertdialog" open={open} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to log out?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={logout} appearance="primary">
                        Ok
                    </Button>
                    <Button onClick={handleClose} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal></>

    );
};

export default AppNavbar;
