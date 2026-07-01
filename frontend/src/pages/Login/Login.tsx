import React, { FC, ReactElement, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Form, Button, Checkbox, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import { selectErrorMessage } from "../../redux-toolkit/auth/auth-selector";
import { resetAuthState, setAuthLoadingState } from "../../redux-toolkit/auth/auth-slice";
import { activateAccount, login } from "../../redux-toolkit/auth/auth-thunks";
import { selectSuccessMessage } from "../../redux-toolkit/user/user-selector";
import { selectIsAuthLoading } from "../../redux-toolkit/auth/auth-selector";
import { FORGOT, REGISTRATION } from "../../constants/routeConstants";
import { LoadingStatus } from "../../types/types";
import FormInput from "../../components/FormInput/FormInput";
import AuthLayout from "../../components/AuthLayout/AuthLayout";

const Login: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { t } = useTranslation();
    const params = useParams<{ code: string }>();
    const errorMessage = useSelector(selectErrorMessage);
    const successMessage = useSelector(selectSuccessMessage);
    const isLoading = useSelector(selectIsAuthLoading);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(setAuthLoadingState(LoadingStatus.LOADED));
        
        if (params.code) {
            dispatch(activateAccount(params.code));
        }

        return () => {
            dispatch(resetAuthState());
        };
    }, []);

    const onClickSignIn = (userData: { email: ""; password: "" }): void => {
        dispatch(login({ userData, history }));
    };

    return (
        <AuthLayout
            title={t('nav.sign_in')}
            subtitle={t('auth.login_description', 'Chào mừng bạn quay trở lại')}
        >
            <Form onFinish={onClickSignIn} layout="vertical" className="auth-form">
                {errorMessage && <Alert type="error" message={errorMessage} style={{ marginBottom: "var(--space-md)" }} />}
                {successMessage && <Alert type="success" message={successMessage} style={{ marginBottom: "var(--space-md)" }} />}
                
                <FormInput
                    title={t('auth.email')}
                    icon={<MailOutlined />}
                    name={"email"}
                    placeholder={t('auth.placeholders.email')}
                />
                
                <FormInput
                    title={t('auth.password')}
                    icon={<LockOutlined />}
                    name={"password"}
                    placeholder={t('auth.placeholders.password')}
                    inputPassword
                />
                
                <div className="auth-actions">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>{t('auth.remember_me', 'Nhớ mật khẩu')}</Checkbox>
                    </Form.Item>
                    <Link to={FORGOT} className="forgot-password-link">
                        {t('auth.forgot_password')}
                    </Link>
                </div>
                
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    className="auth-submit-btn"
                    loading={isLoading}
                    disabled={isLoading}
                    size="large"
                    block
                >
                    {t('auth.sign_in')}
                </Button>
                
                <div className="auth-footer">
                    <Typography.Text>
                        {t('auth.dont_have_account', 'Chưa có tài khoản?')} <Link to={REGISTRATION}>{t('auth.create_account')}</Link>
                    </Typography.Text>
                </div>
            </Form>
        </AuthLayout>
    );
};

export default Login;
