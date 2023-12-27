import React from 'react';
import { Row, Col } from 'rsuite';
import styled from 'styled-components';

// Styled component for HeroContainer
const HeroContainer = styled.div`
    margin-top: 4rem;
    padding: 10px 50px 50px 50px;
    textWrapper-align: center;
`;

// Define the props type
interface HeroProps {
    title: string;
    subtitle?: string; // Make subtitle optional by adding "?"
}

const Hero: React.FC<HeroProps> = ({ title, subtitle }) => {
    return (
        <HeroContainer>
            <Row className="justify-content-center">
                <Col md={6} className="text-center">
                    <h1 className='text-primary'>{title}</h1>
                    {subtitle && <p>{subtitle}</p>}
                </Col>
            </Row>
        </HeroContainer>
    );
};

export default Hero;
