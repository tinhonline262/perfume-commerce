import React, { FC, ReactElement } from "react";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";

export const FooterBrand: FC = (): ReactElement => {
    const { t } = useTranslation();
    return (
        <>
            <Typography.Title level={3}>{t('footer.brandTitle')}</Typography.Title>
            <Typography.Text style={{ display: 'block', fontStyle: 'italic', marginBottom: '12px' }}>
                {t('footer.brandTagline')}
            </Typography.Text>
            <Typography.Text>
                {t('footer.brandDescription')}
            </Typography.Text>
        </>
    );
};
