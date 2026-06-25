import React, { FC, ReactElement, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Col, Divider, Form, Row, Space } from "antd";
import { LockOutlined, LoginOutlined, MailOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import googleLogo from "../../img/google.png";
import facebookLogo from "../../img/facebook.png";
import githubLogo from "../../img/github.png";
import { selectErrorMessage } from "../../redux-toolkit/auth/auth-selector";
import { resetAuthState, setAuthLoadingState } from "../../redux-toolkit/auth/auth-slice";
import { activateAccount, login } from "../../redux-toolkit/auth/auth-thunks";
import { selectSuccessMessage } from "../../redux-toolkit/user/user-selector";
import { selectIsAuthLoading } from "../../redux-toolkit/auth/auth-selector";
import { FORGOT } from "../../constants/routeConstants";
import { LoadingStatus } from "../../types/types";
import SocialButton from "./SocialButton/SocialButton";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import ContentTitle from "../../components/ContentTitle/ContentTitle";
import FormInput from "../../components/FormInput/FormInput";
import IconButton from "../../components/IconButton/IconButton";
import "./Login.css";

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
        <ContentWrapper narrow>
            <ContentTitle icon={<LoginOutlined />} title={t('nav.sign_in')} />
            <Row gutter={32}>
                <Col xs={24} md={12}>
                    <Form onFinish={onClickSignIn}>
                        <Divider />
                        {errorMessage && <Alert type="error" message={errorMessage} />}
                        {successMessage && <Alert type="success" message={successMessage} />}
                        <FormInput
                            title={t('auth.email') + ":"}
                            icon={<MailOutlined />}
                            titleSpan={6}
                            wrapperSpan={18}
                            name={"email"}
                            placeholder={t('auth.placeholders.email')}
                        />
                        <FormInput
                            title={t('auth.password') + ":"}
                            icon={<LockOutlined />}
                            titleSpan={6}
                            wrapperSpan={18}
                            name={"password"}
                            placeholder={t('auth.placeholders.password')}
                            inputPassword
                        />
                        <Space align={"baseline"} size={13}>
                            <IconButton title={t('auth.sign_in')} icon={<LoginOutlined />} loading={isLoading} disabled={isLoading} />
                            <Link to={FORGOT}>{t('auth.forgot_password')}</Link>
                        </Space>
                    </Form>
                </Col>
                <Col xs={24} md={12}>
                    <div className={"social-login-wrapper"}>
                        <SocialButton socialNetwork={"google"} image={googleLogo} />
                        <SocialButton socialNetwork={"facebook"} image={facebookLogo} />
                        <SocialButton socialNetwork={"github"} image={githubLogo} />
                    </div>
                </Col>
            </Row>
        </ContentWrapper>
    );
};

export default Login;
