import React, { FC, ReactElement, useEffect, useState } from "react";
import { Col, Row, Typography, Form, Input, Button, message } from "antd";
import { 
    EnvironmentOutlined, 
    PhoneOutlined, 
    MailOutlined, 
    ClockCircleOutlined, 
    CarOutlined,
    FacebookOutlined,
    InstagramOutlined,
    YoutubeOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import { companyConfig } from "../../config/company";
import "./Contacts.css";

const Contacts: FC = (): ReactElement => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const onFinish = (values: any) => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            message.success(t('contact.form.success'));
            form.resetFields();
        }, 1500);
    };

    return (
        <ContentWrapper>
            <div className="contacts-header">
                <Typography.Title level={2}>{t('contact.title')}</Typography.Title>
                <Typography.Text className="contacts-subtitle">
                    {t('contact.subtitle')}
                </Typography.Text>
            </div>

            <Row gutter={[32, 32]}>
                {/* Contact Information */}
                <Col xs={24} lg={10}>
                    <div className="contact-info-card">
                        <div className="contact-info-item">
                            <EnvironmentOutlined className="contact-info-icon" />
                            <div className="contact-info-content">
                                <Typography.Title level={5} className="contact-info-title">
                                    {t('contact.address')}
                                </Typography.Title>
                                <a href={companyConfig.address.url} target="_blank" rel="noopener noreferrer" className="contact-info-link contact-info-text">
                                    {companyConfig.address.text}
                                </a>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <PhoneOutlined className="contact-info-icon" />
                            <div className="contact-info-content">
                                <Typography.Title level={5} className="contact-info-title">
                                    {t('contact.phone')}
                                </Typography.Title>
                                <a href={companyConfig.phone.uri} className="contact-info-link contact-info-text">
                                    {companyConfig.phone.display}
                                </a>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <MailOutlined className="contact-info-icon" />
                            <div className="contact-info-content">
                                <Typography.Title level={5} className="contact-info-title">
                                    {t('contact.email')}
                                </Typography.Title>
                                <a href={`mailto:${companyConfig.email}`} className="contact-info-link contact-info-text">
                                    {companyConfig.email}
                                </a>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <ClockCircleOutlined className="contact-info-icon" />
                            <div className="contact-info-content">
                                <Typography.Title level={5} className="contact-info-title">
                                    {t('contact.businessHours')}
                                </Typography.Title>
                                <Typography.Text className="contact-info-text">
                                    {t('contacts.time')}
                                </Typography.Text>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <CarOutlined className="contact-info-icon" />
                            <div className="contact-info-content">
                                <Typography.Title level={5} className="contact-info-title">
                                    {t('contact.shipping')}
                                </Typography.Title>
                                <Typography.Text className="contact-info-text">
                                    {t('contacts.delivery_desc')}
                                </Typography.Text>
                            </div>
                        </div>
                        
                        <div className="contact-info-item" style={{ marginTop: 32 }}>
                            <div className="contact-info-content">
                                <Typography.Title level={5} className="contact-info-title">
                                    {t('contact.socialMedia')}
                                </Typography.Title>
                                <div className="contact-social-icons">
                                    <a href={companyConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="contact-social-icon">
                                        <FacebookOutlined />
                                    </a>
                                    <a href={companyConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="contact-social-icon">
                                        <InstagramOutlined />
                                    </a>
                                    <a href={companyConfig.social.youtube} target="_blank" rel="noopener noreferrer" className="contact-social-icon">
                                        <YoutubeOutlined />
                                    </a>
                                    {/* TikTok uses a custom SVG or text usually, but we'll use a link for now as antd doesn't have a built-in TikTok icon in older versions */}
                                    <a href={companyConfig.social.tiktok} target="_blank" rel="noopener noreferrer" className="contact-social-icon">
                                        <span style={{ fontWeight: 'bold', fontSize: '12px' }}>TT</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>

                {/* Contact Form */}
                <Col xs={24} lg={14}>
                    <div className="contact-form-card">
                        <Typography.Title level={4} className="contact-form-title">
                            {t('contact.form.title')}
                        </Typography.Title>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={false}
                        >
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="name"
                                        label={t('contact.form.name')}
                                        rules={[{ required: true, message: t('errors.Fill in the input field') }]}
                                    >
                                        <Input size="large" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="email"
                                        label={t('contact.form.email')}
                                        rules={[
                                            { required: true, message: t('errors.Email cannot be empty') },
                                            { type: 'email', message: t('errors.Incorrect email') }
                                        ]}
                                    >
                                        <Input size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="phone"
                                        label={t('contact.form.phone')}
                                    >
                                        <Input size="large" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="subject"
                                        label={t('contact.form.subject')}
                                        rules={[{ required: true, message: t('errors.Fill in the input field') }]}
                                    >
                                        <Input size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="message"
                                label={t('contact.form.message')}
                                rules={[{ required: true, message: t('errors.Fill in the input field') }]}
                            >
                                <Input.TextArea rows={5} size="large" />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    size="large" 
                                    loading={isSubmitting}
                                    style={{ width: '100%', marginTop: '8px' }}
                                >
                                    {t('contact.form.submit')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>

            {/* Google Map */}
            <div className="contact-map-container">
                <iframe
                    title="Google Maps Location"
                    className="contact-map-iframe"
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=${encodeURIComponent(companyConfig.address.mapQuery)}`}
                    // Fallback to a simpler map if no API key is available (which is the case here, so using an alternative embed)
                    srcDoc={`
                        <html>
                            <body style="margin:0;padding:0;">
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    frameborder="0" 
                                    style="border:0;" 
                                    src="https://maps.google.com/maps?q=${encodeURIComponent(companyConfig.address.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                                    allowfullscreen>
                                </iframe>
                            </body>
                        </html>
                    `}
                    loading="lazy"
                    allowFullScreen
                ></iframe>
            </div>
        </ContentWrapper>
    );
};

export default Contacts;
