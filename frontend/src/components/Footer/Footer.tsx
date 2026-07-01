import React, { FC, ReactElement } from "react";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

import { FooterBrand } from "./FooterBrand/FooterBrand";
import { FooterCustomerService } from "./FooterCustomerService/FooterCustomerService";
import { FooterSocial } from "./FooterSocial/FooterSocial";
import "./Footer.scss";

const Footer: FC = (): ReactElement => {
    const { t } = useTranslation();
    return (
        <div className={"footer-wrapper"}>
            <Row gutter={[32, 32]}>
                <Col xs={24} md={10}>
                    <FooterBrand />
                </Col>
                <Col xs={24} md={7}>
                    <FooterCustomerService />
                </Col>
                <Col xs={24} md={7}>
                    <FooterSocial />
                </Col>
            </Row>
            <Row className={"footer-wrapper-copyright"}>
                <Typography.Text>{t('footer.rights_reserved')}</Typography.Text>
            </Row>
        </div>
    );
};

export default Footer;
