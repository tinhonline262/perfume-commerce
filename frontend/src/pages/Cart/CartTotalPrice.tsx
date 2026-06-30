import React, { FC, ReactElement } from "react";
import { Typography } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { selectTotalPrice } from "../../redux-toolkit/cart/cart-selector";

const CartTotalPrice: FC = (): ReactElement => {
    const { t } = useTranslation();
    const totalPrice = useSelector(selectTotalPrice);

    return <Typography.Title level={3}>{t('cart.total')}: {totalPrice} VND</Typography.Title>;
};

export default CartTotalPrice;
