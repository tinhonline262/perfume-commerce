import React, { FC, ReactElement } from "react";
import { useSelector } from "react-redux";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";

import { selectIsUserLoading, selectUserFromUserState } from "../../../redux-toolkit/user/user-selector";
import Spinner from "../../../components/Spinner/Spinner";

const AccountItem: FC = (): ReactElement => {
    const { t } = useTranslation();
    const usersData = useSelector(selectUserFromUserState);
    const loading = useSelector(selectIsUserLoading);

    return (
        <div className="account-section-card">
            {loading ? (
                <Spinner />
            ) : (
                <div style={{ textAlign: "center", padding: "64px 0" }}>
                    <Typography.Title level={3} style={{ marginBottom: 8 }}>
                        {t('account.hello')} {usersData?.firstName} {usersData?.lastName}!
                    </Typography.Title>
                    <Typography.Text style={{ color: "var(--color-text-secondary)" }}>
                        {t('account.welcome_back', 'Welcome back to your account.')}
                    </Typography.Text>
                </div>
            )}
        </div>
    );
};

export default AccountItem;
