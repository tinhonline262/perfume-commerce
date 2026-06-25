import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";

import { selectOrder } from "../../redux-toolkit/order/order-selector";
import { resetCartState } from "../../redux-toolkit/cart/cart-slice";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";

const OrderFinalize: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const order = useSelector(selectOrder);

    useEffect(() => {
        dispatch(resetCartState());
    }, []);

    return (
        <ContentWrapper>
            <div style={{ textAlign: "center" }}>
                <Typography.Title level={2}>{t('order.finalize.title')}</Typography.Title>
                <Typography.Text>{t('order.finalize.message')} {order.id}</Typography.Text>
            </div>
        </ContentWrapper>
    );
};

export default OrderFinalize;
