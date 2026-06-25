import React, { FC, ReactElement } from "react";
import { Typography, Button } from "antd";
import { Link } from "react-router-dom";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import { ORDER } from "../../constants/routeConstants";

const OrderFailed: FC = (): ReactElement => {
    const { t } = useTranslation();

    return (
        <ContentWrapper>
            <div style={{ textAlign: "center", padding: "50px 0" }}>
                <CloseCircleOutlined style={{ fontSize: "72px", color: "#f5222d", marginBottom: "24px" }} />
                <Typography.Title level={2}>{t('order.failed.title')}</Typography.Title>
                <Typography.Text type="secondary" style={{ display: "block", marginBottom: "32px", fontSize: "16px" }}>
                    {t('order.failed.message')}
                </Typography.Text>
                <Link to={ORDER}>
                    <Button type="primary" size="large">
                        {t('order.failed.button')}
                    </Button>
                </Link>
            </div>
        </ContentWrapper>
    );
};

export default OrderFailed;
