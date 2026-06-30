import React, { FC, ReactElement } from "react";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

import "./Footer.scss";

const Footer: FC = (): ReactElement => {
    const { t } = useTranslation();
    return (
        <div className={"footer-wrapper"}>
            <Row gutter={[32, 32]}>
                <Col xs={24} md={10}>
                    <Typography.Title level={3}>The Aura Perfume</Typography.Title>
                    <Typography.Text style={{ display: 'block', fontStyle: 'italic', marginBottom: '12px' }}>
                        Your Aura, Your Legacy
                    </Typography.Text>
                    <Typography.Text>
                        Curated fragrance, warm materials and quiet packaging for daily rituals.
                    </Typography.Text>
                </Col>
                <Col xs={24} md={7}>
                    <Typography.Title level={4}>{t('footer.customer_service')}</Typography.Title>
                    <Typography.Text className={"mt-12"}>Support: (066) 696-66-23</Typography.Text>
                    <Typography.Text className={"mt-12"}>Open daily from 08:00 to 20:00</Typography.Text>
                </Col>
                <Col xs={24} md={7}>
                    <div className={"footer-wrapper-social"}>
                        <Typography.Title level={4}>Journal</Typography.Title>
                        <a href="https://www.linkedin.com" rel="noreferrer" target="_blank">
                            Notes
                        </a>
                        <a href="https://www.facebook.com" rel="noreferrer" target="_blank">
                            Studio
                        </a>
                        <a href="https://twitter.com" rel="noreferrer" target="_blank">
                            Dispatch
                        </a>
                    </div>
                </Col>
            </Row>
            <Row className={"footer-wrapper-copyright"}>
                <Typography.Text>{t('footer.rights_reserved')}</Typography.Text>
            </Row>
        </div>
    );
};

export default Footer;
