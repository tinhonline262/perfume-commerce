import React, { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "antd";
import { CheckOutlined, EditOutlined, EyeInvisibleOutlined, ProfileOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import { selectUserEditErrors, selectUserFromUserState } from "../../../redux-toolkit/user/user-selector";
import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import AccountDataItem from "../../../components/AccountDataItem/AccountDataItem";
import FormInput from "../../../components/FormInput/FormInput";
import IconButton from "../../../components/IconButton/IconButton";
import { updateUserInfo } from "../../../redux-toolkit/user/user-thunks";
import { resetInputForm } from "../../../redux-toolkit/user/user-slice";
import "./PersonalData.css";

interface PersonalData {
    firstName: string;
    lastName: string;
    city: string;
    address: string;
    phoneNumber: string;
    postIndex: string;
}

const PersonalData: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const usersData = useSelector(selectUserFromUserState);
    const errors = useSelector(selectUserEditErrors);
    const [showUserData, setShowUserData] = useState<boolean>(false);
    const { firstNameError, lastNameError } = errors;

    const onClickShowUserData = (): void => {
        setShowUserData((prevState) => !prevState);
    };

    useEffect(() => {
        dispatch(resetInputForm());

        if (usersData) {
            form.setFieldsValue(usersData);
        }
    }, []);

    const onFormSubmit = (data: PersonalData): void => {
        dispatch(updateUserInfo({ id: usersData?.id, ...data }));
    };

    return (
        <div className="account-section-card">
            <ContentTitle title={t('account.my_account')} titleLevel={4} icon={<ProfileOutlined />} />
            <div className="personal-data-layout">
                <section className="personal-data-summary">
                    <AccountDataItem title={"Email"} text={usersData?.email} />
                    <AccountDataItem title={t('auth.first_name')} text={usersData?.firstName} />
                    <AccountDataItem title={t('auth.last_name')} text={usersData?.lastName} />
                    <AccountDataItem title={t('order.city').replace(":", "")} text={usersData?.city} />
                    <AccountDataItem title={t('order.address').replace(":", "")} text={usersData?.address} />
                    <AccountDataItem title={t('order.mobile').replace(":", "")} text={usersData?.phoneNumber} />
                    <AccountDataItem title={t('order.index').replace(":", "")} text={usersData?.postIndex} />
                    <Button
                        type={"primary"}
                        onClick={onClickShowUserData}
                        icon={showUserData ? <EyeInvisibleOutlined /> : <EditOutlined />}
                    >
                        {showUserData ? t('account.hide', 'Hide') : t('account.edit')}
                    </Button>
                </section>
                <section className="personal-data-edit">
                    {showUserData && (
                        <Form onFinish={onFormSubmit} form={form}>
                            <FormInput
                                title={t('auth.first_name') + ":"}
                                titleSpan={6}
                                wrapperSpan={18}
                                name={"firstName"}
                                error={firstNameError ? t(`errors.${firstNameError}`, firstNameError) : undefined}
                                placeholder={t('auth.placeholders.first_name')}
                            />
                            <FormInput
                                title={t('auth.last_name') + ":"}
                                titleSpan={6}
                                wrapperSpan={18}
                                name={"lastName"}
                                error={lastNameError ? t(`errors.${lastNameError}`, lastNameError) : undefined}
                                placeholder={t('auth.placeholders.last_name')}
                            />
                            <FormInput
                                title={t('order.city')}
                                titleSpan={6}
                                wrapperSpan={18}
                                name={"city"}
                                placeholder={t('order.placeholders.city')}
                            />
                            <FormInput
                                title={t('order.address')}
                                titleSpan={6}
                                wrapperSpan={18}
                                name={"address"}
                                placeholder={t('order.placeholders.address')}
                            />
                            <FormInput
                                title={t('order.mobile')}
                                titleSpan={6}
                                wrapperSpan={18}
                                name={"phoneNumber"}
                                placeholder={t('order.placeholders.mobile')}
                            />
                            <FormInput
                                title={t('order.index')}
                                titleSpan={6}
                                wrapperSpan={18}
                                name={"postIndex"}
                                placeholder={t('order.placeholders.index')}
                            />
                            <IconButton title={t('account.save')} icon={<CheckOutlined />} />
                        </Form>
                    )}
                </section>
            </div>
        </div>
    );
};

export default PersonalData;
