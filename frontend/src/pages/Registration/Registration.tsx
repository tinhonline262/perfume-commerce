import React, { FC, ReactElement, useEffect, useState } from "react";
import { Col, Form, Row, Typography, Button, Progress } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useHistory, Link } from "react-router-dom";

import { selectErrors, selectIsAuthLoading, selectIsRegistered } from "../../redux-toolkit/auth/auth-selector";
import { registration } from "../../redux-toolkit/auth/auth-thunks";
import FormInput from "../../components/FormInput/FormInput";
import { resetAuthState, setAuthLoadingState } from "../../redux-toolkit/auth/auth-slice";
import { LoadingStatus, UserRegistration } from "../../types/types";
import { LOGIN } from "../../constants/routeConstants";
import AuthLayout from "../../components/AuthLayout/AuthLayout";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

const Registration: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { t } = useTranslation();
    const isRegistered = useSelector(selectIsRegistered);
    const isLoading = useSelector(selectIsAuthLoading);
    const errors = useSelector(selectErrors);
    const [captchaValue, setCaptchaValue] = useState<string | null>("");
    const [passwordStrength, setPasswordStrength] = useState<number>(0);
    const [form] = Form.useForm();

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(setAuthLoadingState(LoadingStatus.LOADED));

        return () => {
            dispatch(resetAuthState());
        };
    }, []);

    useEffect(() => {
        setCaptchaValue("");
    }, [isRegistered]);

    const onChangeRecaptcha = (token: string | null): void => {
        setCaptchaValue(token);
    };

    const onClickSignIn = (userData: UserRegistration): void => {
        dispatch(registration({ userRegistrationData: { ...userData, captcha: captchaValue }, history }));
        // @ts-ignore
        if (window.grecaptcha) window.grecaptcha.reset();
    };

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length > 5) strength += 20;
        if (password.length > 7) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 20;
        setPasswordStrength(strength);
    };

    return (
        <AuthLayout
            title={t('nav.sign_up')}
            subtitle={t('auth.create_account_description', 'Tạo tài khoản để trải nghiệm mua sắm tuyệt vời nhất')}
        >
            <Form 
                form={form}
                onFinish={onClickSignIn} 
                layout="vertical"
                className="auth-form"
                onValuesChange={(changedValues) => {
                    if (changedValues.password) {
                        calculatePasswordStrength(changedValues.password);
                    }
                }}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <FormInput
                            title={t('auth.first_name')}
                            icon={<UserOutlined />}
                            name={"firstName"}
                            error={errors.firstNameError ? t(`errors.${errors.firstNameError}`, errors.firstNameError) : undefined}
                            placeholder={t('auth.placeholders.first_name')}
                        />
                    </Col>
                    <Col xs={24} sm={12}>
                        <FormInput
                            title={t('auth.last_name')}
                            icon={<UserOutlined />}
                            name={"lastName"}
                            error={errors.lastNameError ? t(`errors.${errors.lastNameError}`, errors.lastNameError) : undefined}
                            placeholder={t('auth.placeholders.last_name')}
                        />
                    </Col>
                </Row>

                <FormInput
                    title={t('auth.email')}
                    icon={<MailOutlined />}
                    name={"email"}
                    error={errors.emailError ? t(`errors.${errors.emailError}`, errors.emailError) : undefined}
                    placeholder={t('auth.placeholders.email')}
                />

                <div className="password-input-group">
                    <FormInput
                        title={t('auth.password')}
                        icon={<LockOutlined />}
                        name={"password"}
                        error={errors.passwordError ? t(`errors.${errors.passwordError}`, errors.passwordError) : undefined}
                        placeholder={t('auth.placeholders.password')}
                        inputPassword
                    />
                    {form.getFieldValue('password') && (
                        <Progress 
                            percent={passwordStrength} 
                            showInfo={false} 
                            size="small" 
                            status={passwordStrength < 40 ? "exception" : passwordStrength < 80 ? "active" : "success"}
                            className="password-strength-bar"
                        />
                    )}
                </div>

                <Form.Item
                    name="password2"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t('errors.Passwords_do_not_match', 'Mật khẩu không khớp')));
                            },
                        }),
                    ]}
                >
                    <FormInput
                        title={t('auth.password_confirm')}
                        icon={<LockOutlined />}
                        name={"password2"}
                        error={errors.password2Error ? t(`errors.${errors.password2Error}`, errors.password2Error) : undefined}
                        placeholder={t('auth.password_confirm')}
                        inputPassword
                        formItem={false}
                    />
                </Form.Item>

                <div className="recaptcha-container">
                    <Form.Item
                        help={errors.captchaError ? t(`errors.${errors.captchaError}`, errors.captchaError) : undefined}
                        validateStatus={errors.captchaError ? "error" : "validating"}
                    >
                        <ReCAPTCHA
                            onChange={onChangeRecaptcha}
                            sitekey={RECAPTCHA_SITE_KEY}
                        />
                    </Form.Item>
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
                    {t('auth.create_account')}
                </Button>

                <div className="auth-footer">
                    <Typography.Text>
                        {t('auth.already_have_account', 'Đã có tài khoản?')} <Link to={LOGIN}>{t('auth.login', 'Đăng nhập')}</Link>
                    </Typography.Text>
                </div>
            </Form>
        </AuthLayout>
    );
};

export default Registration;
