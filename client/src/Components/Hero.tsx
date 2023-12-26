import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';

const HeroContainer = styled(Container)`
  margin-top: 4rem;
  padding:10px 50px 50px 50px;
`;

// Define the props type
interface HeroProps {
    title: string;
    subtitle: string | undefined;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle }) => {
    return (
        <HeroContainer>
            <Row className="justify-content-center">
                <Col md={6} className="text-center">

                    <h1 className='text-primery'>{title}</h1>
                    {subtitle ? <p>{subtitle}</p> : <></>}

                </Col>
            </Row>
        </HeroContainer>
    );
};

export default Hero;
