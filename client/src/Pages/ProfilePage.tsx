

import { useState, useEffect } from 'react';
import Hero from '../Components/Hero';
import { Grid, Row, Col, Form, Button } from 'rsuite';
import axios, { AxiosResponse } from 'axios';

import { OverlayTrigger, Popover, Image } from 'react-bootstrap'

const ProfilePage = () => {
    const [avatarUrl, setAvatarUrl] = useState<string>('');

    useEffect(() => {
        // Fetch a random avatar from DiceBear Avatars API
        axios.get('https://avatars.dicebear.com/api/avataaars/example.svg?options[mood][]=happy').then((response: AxiosResponse) => {
            setAvatarUrl(response.config?.url ?? ''); // Using nullish coalescing operator
        });
    }, []);

    return (


        <Grid>
            <Row className="justify-content-center">
                <Hero title="Profile Information" subtitle={undefined} />
            </Row>
            <Row>
                <Col md={6} className="mb-4">
                    <OverlayTrigger
                        trigger="hover"
                        placement="bottom"
                        overlay={<Popover id="popover-avatar-edit">
                            <Popover.Body>Edit Avatar</Popover.Body>
                        </Popover>}
                    >
                        <div className="text-center">
                            <Image
                                src={avatarUrl}
                                alt="Avatar"
                                roundedCircle
                                width={150}
                                height={150} />
                        </div>
                    </OverlayTrigger>

                    <Form className="mt-3">
                        {/* <Form.Group className="mb-3" controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Your Name" />
    </Form.Group> */}

                        <h5>Last Login</h5>


                    </Form>
                </Col>

                <Col md={6} className="mb-4">
                    <h2>Change Password</h2>
                    <Form>
                        {/* <Form.Group className="mb-3" controlId="formCurrentPassword">
        <Form.Label>Current Password</Form.Label>
        <Form.Control type="password" placeholder="Current Password" />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formNewPassword">
        <Form.Label>New Password</Form.Label>
        <Form.Control type="password" placeholder="New Password" />
    </Form.Group> */}

                        {/* <Form.Group className="mb-3" controlId="formConfirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="password" placeholder="Confirm Password" />
    </Form.Group> */}

                        <Button appearance="primary" type="submit">
                            Change Password
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Grid>

    );
};

export default ProfilePage;
