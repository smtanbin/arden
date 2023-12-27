import { useState, useEffect } from 'react';
import { Row, Col } from 'rsuite';
import styled from 'styled-components';
import brandLogo from '../assets/react.svg'; // Replace with the path to your brand logo

const FooterWrapper = styled.footer`

    padding: 20px 0;
    `;

const BrandLogo = styled.img`
    width: 100px;
    `;

const FooterComponent: React.FC = () => {
    const [renderTime, setRenderTime] = useState<number | null>(null);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const startTime = performance.now();

        // Simulate some heavy rendering logic here
        for (let i = 0; i < 1000000; i++) {
            // Do some computation
        }

        const endTime = performance.now();
        const renderTimeInMs = endTime - startTime;
        setRenderTime(renderTimeInMs);
    }, []); // Run this effect only once after the initial render

    return (
        <section>
            <br />
            <br />
            <br />
            <br />
            <FooterWrapper>
                <br />

                <Row>
                    <Col md={6}>
                        <Row>
                            <Col xs={6} md={12}>
                                <BrandLogo src={brandLogo} alt="Brand Logo" />
                            </Col>
                            <Col xs={6} md={12} className="mt-3">
                                <p>&copy; {currentYear} Your Company Name. All rights reserved.</p>
                            </Col>
                        </Row>
                    </Col>

                    <Col md={3}>
                        <h5>Contact</h5>
                        <p>
                            Your Company Name
                            <br />
                            123 Main Street, City
                            <br />
                            Country, Zip Code
                            <br />
                            Email: info@example.com
                            <br />
                            Phone: +1 (123) 456-7890
                        </p>
                    </Col>

                    <Col md={3}>
                        <h5>Links</h5>
                        <ul>
                            <li>
                                <a href="/reset-password">Reset Password</a>
                            </li>
                            <li>
                                <a href="/audit-log">Audit Log</a>
                            </li>
                        </ul>
                    </Col>
                </Row>

                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                    {renderTime !== null && <p>Render Time: {renderTime.toFixed(2)} ms</p>}
                </div>
            </FooterWrapper></section>
    );
};

export default FooterComponent;
