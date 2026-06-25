import React, { FC, ReactElement, useEffect, useState } from "react";
import { Col, Divider, Form, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import { LockOutlined, MailOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import { selectErrors, selectIsAuthLoading, selectIsRegistered } from "../../redux-toolkit/auth/auth-selector";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import ContentTitle from "../../components/ContentTitle/ContentTitle";
import { registration } from "../../redux-toolkit/auth/auth-thunks";
import FormInput from "../../components/FormInput/FormInput";
import IconButton from "../../components/IconButton/IconButton";
import { resetAuthState, setAuthLoadingState } from "../../redux-toolkit/auth/auth-slice";
import { LoadingStatus, UserRegistration } from "../../types/types";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

const Registration: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const isRegistered = useSelector(selectIsRegistered);
    const isLoading = useSelector(selectIsAuthLoading);
    const errors = useSelector(selectErrors);
    const [captchaValue, setCaptchaValue] = useState<string | null>("");

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
        dispatch(registration({ ...userData, captcha: captchaValue }));
        // @ts-ignore
        if (window.grecaptcha) window.grecaptcha.reset();
    };

    return (
        <ContentWrapper narrow>
            <ContentTitle icon={<UserAddOutlined />} title={t('nav.sign_up')} />
            <Row justify="center">
                <Col xs={24} md={18} lg={12}>
                    <Form onFinish={onClickSignIn}>
                        <Divider />
                        <FormInput
                            title={t('auth.email') + ":"}
                            icon={<MailOutlined />}
                            titleSpan={8}
                            wrapperSpan={16}
                            name={"email"}
                            error={errors.emailError ? t(`errors.${errors.emailError}`, errors.emailError) : undefined}
                            placeholder={t('auth.placeholders.email')}
                        />
                        <FormInput
                            title={t('auth.first_name') + ":"}
                            icon={<UserOutlined />}
                            titleSpan={8}
                            wrapperSpan={16}
                            name={"firstName"}
                            error={errors.firstNameError ? t(`errors.${errors.firstNameError}`, errors.firstNameError) : undefined}
                            placeholder={t('auth.placeholders.first_name')}
                        />
                        <FormInput
                            title={t('auth.last_name') + ":"}
                            icon={<UserOutlined />}
                            titleSpan={8}
                            wrapperSpan={16}
                            name={"lastName"}
                            error={errors.lastNameError ? t(`errors.${errors.lastNameError}`, errors.lastNameError) : undefined}
                            placeholder={t('auth.placeholders.last_name')}
                        />
                        <FormInput
                            title={t('auth.password') + ":"}
                            icon={<LockOutlined />}
                            titleSpan={8}
                            wrapperSpan={16}
                            name={"password"}
                            error={errors.passwordError ? t(`errors.${errors.passwordError}`, errors.passwordError) : undefined}
                            placeholder={t('auth.placeholders.password')}
                            inputPassword
                        />
                        <FormInput
                            title={t('auth.password_confirm') + ":"}
                            icon={<LockOutlined />}
                            titleSpan={8}
                            wrapperSpan={16}
                            name={"password2"}
                            error={errors.password2Error ? t(`errors.${errors.password2Error}`, errors.password2Error) : undefined}
                            placeholder={t('auth.password_confirm')}
                            inputPassword
                        />
                        <Row justify="center" style={{ marginTop: 16 }}>
                            <IconButton disabled={isLoading} loading={isLoading} title={t('auth.create_account')} icon={<UserAddOutlined />} />
                        </Row>
                        <Row justify="center" style={{ marginTop: 16 }}>
                            <Form.Item
                                help={errors.captchaError ? t(`errors.${errors.captchaError}`, errors.captchaError) : undefined}
                                validateStatus={errors.captchaError ? "error" : "validating"}
                            >
                                <ReCAPTCHA
                                    onChange={onChangeRecaptcha}
                                    sitekey={RECAPTCHA_SITE_KEY}
                                />
                            </Form.Item>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </ContentWrapper>
    );
};

export default Registration;
