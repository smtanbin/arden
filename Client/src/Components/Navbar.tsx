import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Avatar, Modal, Button } from 'rsuite';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CogIcon from '@rsuite/icons/legacy/Cog';
import { faCreditCard, faMoneyBills, faBook } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../apps/useAuth';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/arden_logo.svg';








const AppNavbar: React.FC = () => {

    const auth = useAuth();
    const navigate = useNavigate();
    const username: string = auth.token?.username || 'guest';

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const logout = async () => {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        const data: { username: string; refreshToken: string } = {
            username: username || '', // Assuming you have a valid username in your auth context
            refreshToken: auth.token?.refreshToken || '',
        };

        try {
            const response = await fetch("http://10.140.6.65:4000/api/v1/oauth/logout", {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            });

            if (response.ok) {
                auth.logout(); // Assuming you have a logout method in your useAuth hook
                setOpen(false)// Close the modal after successful logout
                navigate("/login", { replace: true });
            } else {
                console.error("Logout failed:", response.status, response.statusText);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Logout failed:", error.message);
        } finally {
            setOpen(false)
        }
    };



    return (

        <><Navbar style={{ backgroundColor: "#EFFFE8" }}>

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
                <Nav.Menu icon={<FontAwesomeIcon icon={faBook} />} title="Dispute">
                    <Link to={"/addDispute"}><Nav.Item>Add Dispute</Nav.Item></Link>
                    <Link to={"/disputeList"}><Nav.Item>Dispute list</Nav.Item></Link>
                </Nav.Menu>
                <Nav.Menu icon={<CogIcon />} title="Admin">
                    <Link to={"/approve_profile"}><Nav.Item>Pending User</Nav.Item></Link>
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
            </Nav>

        </Navbar><Modal role="alertdialog" open={open} onClose={handleClose}>
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
