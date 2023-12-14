import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import logo from '../assets/logo.svg';
import { useAuth } from '../apps/useAuth';

import { useState } from 'react';
import LogoutModal from '../Pages/LogoutModal';

const AppNavbar: React.FC = () => {

    const { token } = useAuth();
    const username: string = token?.username || 'guest';

    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const showLogoutModal = () => {
        setLogoutModalVisible(true);
    };

    const hideLogoutModal = () => {
        setLogoutModalVisible(false);
    };







    return (
        <><Navbar fixed="top" expand="lg" style={{ backgroundColor: '#EFFFE8' }}>
            <div className="container">
                <Link to={`/`}>
                    <Navbar.Brand>
                        <img
                            src={logo}
                            alt="Logo"
                            height="30"
                            className="d-inline-block align-top" />
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="ATM" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#">ATM Monitor</NavDropdown.Item>
                            <NavDropdown.Item href="#">Downtime</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Cards" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#">Production List</NavDropdown.Item>
                            <NavDropdown.Item href="#">Card Mailer List</NavDropdown.Item>
                            <NavDropdown.Item href="#">PIN Mailer List</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">Card Status</NavDropdown.Item>
                            <NavDropdown.Item href="#">Reissue Card</NavDropdown.Item>
                            <NavDropdown.Item><Link to={`/cardActivation`}>Card Activision</Link></NavDropdown.Item>

                            <NavDropdown.Item href="#">Disable Card</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Dispute" id="basic-nav-dropdown">

                            <NavDropdown.Item href="/dispute">Add Dispute</NavDropdown.Item>
                            <NavDropdown.Item href="/">Dispute list</NavDropdown.Item>


                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">Logout</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Report" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#">MIS</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Call Center" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#">Search</NavDropdown.Item>
                            <NavDropdown.Item href="#">Customer List</NavDropdown.Item>
                            <NavDropdown.Item href="#">Account List</NavDropdown.Item>
                            <NavDropdown.Item href="#">Branch Address</NavDropdown.Item>
                            <NavDropdown.Item href="#">Branch SIP</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                    <Nav>
                        <NavDropdown title={
                            <span>{username.slice(0, 1).toUpperCase()
                            }
                            </span>} id="profile-dropdown">

                            <NavDropdown.Item href="/userprofile">Profile</NavDropdown.Item>

                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={showLogoutModal}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar><LogoutModal
                visible={logoutModalVisible}
                onConfirm={() => {
                    // Add any additional logic you need on confirmation
                    hideLogoutModal();
                }}
                onCancel={hideLogoutModal} /></>

    );
};

export default AppNavbar;
