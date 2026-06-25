import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import { selectIsOrdersLoading, selectOrders } from "../../../redux-toolkit/orders/orders-selector";
import { fetchAllUsersOrders } from "../../../redux-toolkit/orders/orders-thunks";
import { resetOrders } from "../../../redux-toolkit/orders/orders-slice";
import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import OrdersTable from "../../../components/OrdersTable/OrdersTable";

const OrdersList: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const adminOrders = useSelector(selectOrders);
    const isOrderLoading = useSelector(selectIsOrdersLoading);

    useEffect(() => {
        dispatch(fetchAllUsersOrders(0));

        return () => {
            dispatch(resetOrders());
        };
    }, []);

    return (
        <div className="account-section-card">
            <ContentTitle title={t('account.admin.orders_list')} titleLevel={4} icon={<ShoppingOutlined />} />
            <div style={{ marginTop: 32 }}>
                <OrdersTable orders={adminOrders} loading={isOrderLoading} fetchOrders={fetchAllUsersOrders} />
            </div>
        </div>
    );
};

export default OrdersList;
