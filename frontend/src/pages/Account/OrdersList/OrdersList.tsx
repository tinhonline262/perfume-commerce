import React, { FC, ReactElement, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Tabs, Input } from "antd";

import { selectIsOrdersLoading, selectOrders } from "../../../redux-toolkit/orders/orders-selector";
import { fetchAllUsersOrders } from "../../../redux-toolkit/orders/orders-thunks";
import { resetOrders } from "../../../redux-toolkit/orders/orders-slice";
import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import OrdersTable from "../../../components/OrdersTable/OrdersTable";
import { getOrderStatusLabel, getPaymentStatusLabel } from "../../../utils/statusUtils";

const { TabPane } = Tabs;

const OrdersList: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const adminOrders = useSelector(selectOrders);
    const isOrderLoading = useSelector(selectIsOrdersLoading);
    const [currentTab, setCurrentTab] = useState("ALL");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        dispatch(fetchAllUsersOrders(0));

        return () => {
            dispatch(resetOrders());
        };
    }, []);

    const filteredOrders = useMemo(() => {
        let filtered = adminOrders;
        
        // Tab Filtering
        if (currentTab !== "ALL") {
            if (currentTab === "UNPAID") {
                filtered = filtered.filter(o => o.paymentStatus === "UNPAID");
            } else if (currentTab === "PAID") {
                filtered = filtered.filter(o => o.paymentStatus === "PAID");
            } else if (currentTab === "FAILED") {
                filtered = filtered.filter(o => o.paymentStatus === "FAILED");
            } else if (currentTab === "REFUNDED") {
                filtered = filtered.filter(o => o.paymentStatus === "REFUNDED");
            } else {
                // Order Status filtering
                filtered = filtered.filter(o => o.orderStatus === currentTab);
            }
        }

        // Search filtering (basic local filter for demonstration)
        if (searchText) {
            const lower = searchText.toLowerCase();
            filtered = filtered.filter(o => 
                String(o.id).includes(lower) ||
                o.email.toLowerCase().includes(lower) ||
                (o.firstName + " " + o.lastName).toLowerCase().includes(lower) ||
                o.phoneNumber?.includes(lower)
            );
        }

        return filtered;
    }, [adminOrders, currentTab, searchText]);

    return (
        <div className="account-section-card">
            <ContentTitle title={t('account.admin.orders_list')} titleLevel={4} icon={<ShoppingOutlined />} />
            
            <div style={{ marginTop: 24, marginBottom: 16 }}>
                <Input 
                    placeholder="Search by Order ID, Customer Name, Email, or Phone..." 
                    prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                    style={{ width: 400, borderRadius: 20 }}
                />
            </div>

            <Tabs defaultActiveKey="ALL" onChange={(key) => setCurrentTab(key)}>
                <TabPane tab={t('status.all', 'All')} key="ALL" />
                <TabPane tab={getPaymentStatusLabel('UNPAID', t)} key="UNPAID" />
                <TabPane tab={getPaymentStatusLabel('PAID', t)} key="PAID" />
                <TabPane tab={getOrderStatusLabel('PENDING', t)} key="PENDING" />
                <TabPane tab={getOrderStatusLabel('PREPARING', t)} key="PREPARING" />
                <TabPane tab={getOrderStatusLabel('READY_TO_SHIP', t)} key="READY_TO_SHIP" />
                <TabPane tab={getOrderStatusLabel('SHIPPING', t)} key="SHIPPING" />
                <TabPane tab={getOrderStatusLabel('DELIVERED', t)} key="DELIVERED" />
                <TabPane tab={getOrderStatusLabel('CANCELLED', t)} key="CANCELLED" />
                <TabPane tab={getPaymentStatusLabel('FAILED', t)} key="FAILED" />
                <TabPane tab={getPaymentStatusLabel('REFUNDED', t)} key="REFUNDED" />
            </Tabs>

            <div style={{ marginTop: 16 }}>
                <OrdersTable orders={filteredOrders} loading={isOrderLoading} fetchOrders={fetchAllUsersOrders} isAdmin={true} />
            </div>
        </div>
    );
};

export default OrdersList;
