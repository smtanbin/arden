import { Col } from 'rsuite';
import ATM from './ATM';
import CardProduction from './CardProduction';




const Dashboard: React.FC = () => {
    return (
        <section style={{ marginTop: "15vh" }}>
            <Col>
                <ATM />
                <CardProduction />
            </Col>
        </section>


    );
};


export default Dashboard;
