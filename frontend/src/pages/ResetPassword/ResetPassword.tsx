import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LockOutlined, ReloadOutlined, SyncOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";
import { Alert, Col, Divider, Form, Row } from "antd";
import { useTranslation } from "react-i18next";

import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import ContentTitle from "../../components/ContentTitle/ContentTitle";
import { selectErrorMessage, selectErrors, selectUserAuthEmail } from "../../redux-toolkit/auth/auth-selector";
import { resetAuthState } from "../../redux-toolkit/auth/auth-slice";
import { fetchResetPasswordCode, resetPassword } from "../../redux-toolkit/auth/auth-thunks";
import FormInput from "../../components/FormInput/FormInput";
import IconButton from "../../components/IconButton/IconButton";

const ResetPassword: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const params = useParams<{ code: string }>();
    const history = useHistory();
    const userEmail = useSelector(selectUserAuthEmail);
    const errorMessage = useSelector(selectErrorMessage);
    const resetPasswordErrors = useSelector(selectErrors);
    const { passwordError, password2Error } = resetPasswordErrors;

    useEffect(() => {
        dispatch(resetAuthState());

        if (params.code) {
            dispatch(fetchResetPasswordCode(params.code));
        }
    }, []);

    const onClickReset = (data: { password: ""; password2: "" }): void => {
        const userResetPasswordData = { email: userEmail, ...data };
        dispatch(resetPassword({ request: userResetPasswordData, history }));
    };

    return (
        <ContentWrapper narrow>
            <ContentTitle icon={<SyncOutlined />} title={t('auth.reset_title')} />
            <Row gutter={32}>
                <Col xs={24} md={12}>
                    <Form onFinish={onClickReset}>
                        <Divider />
                        {errorMessage && <Alert type="error" message={errorMessage} />}
                        <FormInput
                            title={t('auth.new_password') + ":"}
                            icon={<LockOutlined />}
                            titleSpan={8}
                            wrapperSpan={16}
                            error={passwordError ? t(`errors.${passwordError}`, passwordError) : undefined}
                            name={"password"}
                            placeholder={t('auth.placeholders.password')}
                            inputPassword
                        />
                        <FormInput
                            title={t('auth.password_confirm') + ":"}
                            icon={<LockOutlined />}
                            titleSpan={8}
                            wrapperSpan={16}
                            error={password2Error ? t(`errors.${password2Error}`, password2Error) : undefined}
                            name={"password2"}
                            placeholder={t('auth.password_confirm')}
                            inputPassword
                        />
                        <IconButton title={t('auth.save_password', 'Save Password')} icon={<ReloadOutlined />} />
                    </Form>
                </Col>
            </Row>
        </ContentWrapper>
    );
};

export default ResetPassword;
