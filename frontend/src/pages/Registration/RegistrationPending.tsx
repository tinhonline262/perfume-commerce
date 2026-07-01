import React, { FC, ReactElement, useEffect } from "react";
import { Button, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import { LOGIN } from "../../constants/routeConstants";
import "./RegistrationPending.css";

const RegistrationPending: FC = (): ReactElement => {
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <ContentWrapper>
            <div className="registration-pending-container">
                <div className="registration-pending-card">
                    <div className="registration-pending-icon-wrapper">
                        <MailOutlined className="registration-pending-icon" />
                    </div>
                    
                    <Typography.Title level={2} className="registration-pending-title">
                        {t('auth.check_email', 'Kiểm tra email của bạn')}
                    </Typography.Title>
                    
                    <Typography.Text className="registration-pending-description">
                        {t('auth.check_email_description', 'Chúng tôi đã gửi liên kết xác minh đến email của bạn. Vui lòng mở email và nhấp vào liên kết để kích hoạt tài khoản.')}
                    </Typography.Text>
                    
                    <Link to={LOGIN} className="registration-pending-btn-link">
                        <Button type="primary" size="large" block className="registration-pending-btn">
                            {t('auth.go_to_login', 'Đến trang đăng nhập')}
                        </Button>
                    </Link>
                    
                    <div className="registration-pending-resend">
                        <Typography.Text>
                            {t('auth.didnt_receive_email', 'Không nhận được email?')}
                            <Button type="link" className="registration-pending-resend-btn">
                                {t('auth.resend_verification_email', 'Gửi lại email xác minh')}
                            </Button>
                        </Typography.Text>
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
};

export default RegistrationPending;
