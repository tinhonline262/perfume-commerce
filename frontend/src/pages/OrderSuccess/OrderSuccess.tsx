import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Typography, Button } from "antd";
import { Link } from "react-router-dom";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import { resetCartState } from "../../redux-toolkit/cart/cart-slice";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import { BASE } from "../../constants/routeConstants";

const OrderSuccess: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(resetCartState());
        localStorage.removeItem("perfumes");
    }, []);

    return (
        <ContentWrapper>
            <div style={{ textAlign: "center", padding: "50px 0" }}>
                <CheckCircleOutlined style={{ fontSize: "72px", color: "#52c41a", marginBottom: "24px" }} />
                <Typography.Title level={2}>{t('order.success.title')}</Typography.Title>
                <Typography.Text type="secondary" style={{ display: "block", marginBottom: "32px", fontSize: "16px" }}>
                    {t('order.success.message')}
                </Typography.Text>
                <Link to={BASE}>
                    <Button type="primary" size="large">
                        {t('order.success.button')}
                    </Button>
                </Link>
            </div>
        </ContentWrapper>
    );
};

export default OrderSuccess;
