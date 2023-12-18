// import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'rsuite';
import HomeIcon from '@rsuite/icons/legacy/Home';
import CogIcon from '@rsuite/icons/legacy/Cog';
// import logo from '../assets/logo.svg';
// import { useAuth } from '../apps/useAuth';






const AppNavbar: React.FC = () => {

    // const { token } = useAuth();
    // const username: string = token?.username || 'guest';

    // const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    // const showLogoutModal = () => {
    //     setLogoutModalVisible(true);
    // };

    // const hideLogoutModal = () => {
    //     setLogoutModalVisible(false);
    // };


    return (
        <Navbar>
            <Nav>
                <Navbar.Brand href="#">RSUITE</Navbar.Brand>
                <Nav>
                    <Nav.Item icon={<HomeIcon />}>Home</Nav.Item>


                    <Nav.Menu title="ATM">
                        <Nav.Item>ATM Monitor</Nav.Item>
                        <Nav.Item>Downtime</Nav.Item>
                        <Nav.Item>Extra Cash</Nav.Item>
                    </Nav.Menu>
                    <Nav.Menu title="Cards">
                        <Nav.Item>Production List</Nav.Item>

                    </Nav.Menu>
                    <Nav.Menu title="Dispute">
                        <Link to={"/addDispute"}><Nav.Item>Add Dispute</Nav.Item></Link>
                        <Link to={"/disputeList"}><Nav.Item>Dispute list</Nav.Item></Link>

                    </Nav.Menu>
                </Nav>
                <Nav pullRight>
                    <Nav.Item icon={<CogIcon />}>Settings</Nav.Item>
                </Nav>
            </Nav>
        </Navbar>

    );
};

export default AppNavbar;
