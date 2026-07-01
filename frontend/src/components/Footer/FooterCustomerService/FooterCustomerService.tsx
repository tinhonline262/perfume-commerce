import React, { FC, ReactElement } from "react";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";

export const FooterCustomerService: FC = (): ReactElement => {
    const { t } = useTranslation();
    return (
        <>
            <Typography.Title level={4}>{t('footer.customer_service')}</Typography.Title>
            <Typography.Text className={"mt-12"} style={{ display: 'block' }}>{t('footer.support')}</Typography.Text>
            <Typography.Text className={"mt-12"} style={{ display: 'block' }}>{t('footer.openHours')}</Typography.Text>
        </>
    );
};
