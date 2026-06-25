import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Col, Form, Row } from "antd";
import { KeyOutlined, UndoOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import { selectSuccessMessage, selectUserResetPasswordErrors } from "../../../redux-toolkit/user/user-selector";
import { resetInputForm } from "../../../redux-toolkit/user/user-slice";
import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import FormInput from "../../../components/FormInput/FormInput";
import IconButton from "../../../components/IconButton/IconButton";
import { updateUserPassword } from "../../../redux-toolkit/user/user-thunks";

const ChangePassword: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const errors = useSelector(selectUserResetPasswordErrors);
    const successMessage = useSelector(selectSuccessMessage);
    const { passwordError, password2Error } = errors;

    useEffect(() => {
        dispatch(resetInputForm());
    }, []);

    useEffect(() => {
        if (successMessage) {
            form.resetFields();
        }
    }, [successMessage]);

    const onFormSubmit = (data: { password: string; password2: string }): void => {
        dispatch(updateUserPassword({ ...data }));
    };

    return (
        <div className="account-section-card">
            <ContentTitle title={t('account.change_password')} titleLevel={4} icon={<KeyOutlined />} />
            <Form onFinish={onFormSubmit} form={form} style={{ marginTop: 32 }}>
                <Row>
                    <Col xs={24} md={12}>
                        {successMessage && (
                            <Alert type="success" message={successMessage} style={{ marginBottom: 16 }} />
                        )}
                        <FormInput
                            title={t('account.new_password')}
                            titleSpan={10}
                            wrapperSpan={14}
                            name={"password"}
                            error={passwordError ? t(`errors.${passwordError}`, passwordError) : undefined}
                            placeholder={t('auth.placeholders.password')}
                            inputPassword
                        />
                        <FormInput
                            title={t('account.confirm_password')}
                            titleSpan={10}
                            wrapperSpan={14}
                            name={"password2"}
                            error={password2Error ? t(`errors.${password2Error}`, password2Error) : undefined}
                            placeholder={t('auth.placeholders.password')}
                            inputPassword
                        />
                        <IconButton title={t('account.update_password', 'Change')} icon={<UndoOutlined />} />
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default ChangePassword;
