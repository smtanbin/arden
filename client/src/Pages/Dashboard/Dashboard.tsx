import { Col, Container } from 'rsuite';
import ATM from './ATM';
import CardProduction from './CardProduction';




const Dashboard: React.FC = () => {
    return (
        <section style={{ marginTop: "15vh" }}>
            <Container>

                <Col>
                    <ATM />
                    <CardProduction />
                </Col>

            </Container>
        </section>


    );
};


export default Dashboard;