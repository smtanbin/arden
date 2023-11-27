import React from 'react';
import { Col, Container } from 'react-bootstrap';
import ATM from './ATM';
import CardProduction from './CardProduction';
import Dispute from './Dispute';



const Dashboard: React.FC = () => {
    return (
        <section style={{ marginTop: "15vh" }}>
            <Container>

                <Col>
                    <ATM />
                    <CardProduction />
                </Col>
                <Col>
                    <Dispute />
                </Col>
            </Container>
        </section>


    );
};


export default Dashboard;
