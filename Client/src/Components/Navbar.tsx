import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import logo from '../assets/logo.svg';

const AppNavbar: React.FC = () => {
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        // Fetch a random avatar from DiceBear Avatars API
        axios.get('https://avatars.dicebear.com/api/avataaars/example.svg?options[mood][]=happy').then((response: AxiosResponse) => {
            setAvatarUrl(response.config?.url ?? ''); // Using nullish coalescing operator
        });
    }, []);


    return (
        <Navbar fixed="top" expand="lg" style={{ backgroundColor: '#EFFFE8' }}>
            <div className="container">
                <Link to={`/`}>
                    <Navbar.Brand>
                        <img
                            src={logo}
                            alt="Logo"
                            height="30"
                            className="d-inline-block align-top"
                        />
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
                            <NavDropdown.Item href="#">Activision</NavDropdown.Item>
                            <NavDropdown.Item href="#">Disable Card</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Dispute" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#">Profile</NavDropdown.Item>
                            <NavDropdown.Item href="#">Settings</NavDropdown.Item>
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
                            <>
                                <img src={avatarUrl} height="30" alt="Profile" className="profile-image" /> <small>Unknown</small>
                            </>
                        } id="profile-dropdown">
                            <Link to={`/userprofile`}><NavDropdown.Item>Test Profile</NavDropdown.Item></Link>
                            <NavDropdown.Item href="/userprofile">Profile</NavDropdown.Item>

                            <NavDropdown.Divider />
                            <NavDropdown.Item >Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
};

export default AppNavbar;
