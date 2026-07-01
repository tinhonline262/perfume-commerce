import React, { FC, ReactNode } from "react";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import "./AuthLayout.css";

type PropsType = {
    children: ReactNode;
    title: string;
    subtitle: string;
};

const AuthLayout: FC<PropsType> = ({ children, title, subtitle }) => {
    const { t } = useTranslation();

    return (
        <div className="auth-container">
            <Row style={{ minHeight: "100vh" }}>
                <Col xs={24} md={10} lg={12} className="auth-hero">
                    <div className="auth-hero-overlay"></div>
                    <div className="auth-hero-content">
                        <Typography.Title level={1} className="auth-hero-title">
                            The Aura Perfume
                        </Typography.Title>
                        <Typography.Text className="auth-hero-subtitle">
                            {t('auth.slogan', 'Khám phá mùi hương mang đậm dấu ấn của bạn.')}
                        </Typography.Text>
                    </div>
                </Col>
                <Col xs={24} md={14} lg={12} className="auth-form-column">
                    <div className="auth-form-wrapper">
                        <div className="auth-header">
                            <Typography.Title level={2} className="auth-title">
                                {title}
                            </Typography.Title>
                            <Typography.Text className="auth-subtitle">
                                {subtitle}
                            </Typography.Text>
                        </div>
                        {children}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default AuthLayout;
