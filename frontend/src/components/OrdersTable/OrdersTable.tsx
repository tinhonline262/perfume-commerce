import React, { FC, ReactElement } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { AsyncThunk } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";

import { HeaderResponse, OrderResponse } from "../../types/types";
import { ACCOUNT_USER_ORDERS } from "../../constants/routeConstants";
import { selectTotalElements } from "../../redux-toolkit/orders/orders-selector";
import { useTablePagination } from "../../hooks/useTablePagination";

type PropsType = {
    orders: Array<OrderResponse>;
    loading: boolean;
    fetchOrders: AsyncThunk<HeaderResponse<OrderResponse>, number, {}>;
};

const OrdersTable: FC<PropsType> = ({ orders, loading, fetchOrders }): ReactElement => {
    const { t } = useTranslation();
    const totalElements = useSelector(selectTotalElements);
    const handleTableChange = useTablePagination<OrderResponse, number>(fetchOrders);

    return (
        <Table
            rowKey={"id"}
            onChange={handleTableChange}
            loading={loading}
            pagination={{
                total: totalElements,
                position: ["bottomRight", "topRight"]
            }}
            dataSource={orders}
            columns={[
                {
                    title: t('account.order_id', 'Order №'),
                    dataIndex: "id",
                    key: "id"
                },
                {
                    title: t('account.order_date', 'Date'),
                    dataIndex: "date",
                    key: "date",
                    sorter: (a, b) => a.date.localeCompare(b.date)
                },
                {
                    title: t('account.customer', 'Customer'),
                    dataIndex: "firstName",
                    key: "firstName",
                    ellipsis: true,
                    render: (_, order: OrderResponse) => `${order.firstName} ${order.lastName}`
                },
                {
                    title: "Email",
                    dataIndex: "email",
                    key: "email",
                    ellipsis: true
                },
                {
                    title: t('account.order_total', 'Sum, $'),
                    dataIndex: "totalPrice",
                    key: "totalPrice",
                    sorter: (a, b) => a.totalPrice - b.totalPrice
                },
                {
                    title: t('account.order_status', 'Status'),
                    dataIndex: "paymentStatus",
                                        key: "paymentStatus",
                    render: (status: string) => {
                        let color = "default";
                        if (status === "SUCCESS") color = "green";
                        if (status === "FAILED") color = "red";
                        if (status === "PENDING") color = "orange";
                        if (status === "PREPARING") color = "geekblue";
                        if (status === "PREPARED") color = "cyan";
                        if (status === "DELIVERING") color = "purple";
                        if (status === "DELIVERED") color = "green";
                        return <span style={{ color }}>{status || "N/A"}</span>;
                    }
                },
                {
                    title: t('account.actions', 'Actions'),
                    dataIndex: "operations",
                    key: "operations",
                    render: (_, order: OrderResponse) => (
                        <Link 
                            to={`${ACCOUNT_USER_ORDERS}/${order.id}`}
                            style={{ 
                                color: "var(--color-primary)", 
                                fontWeight: 700, 
                                fontSize: 12, 
                                textTransform: "uppercase", 
                                letterSpacing: "0.06em" 
                            }}
                        >
                            {t('account.details', 'Details')}
                        </Link>
                    )
                }
            ]}
        />
    );
};

export default OrdersTable;
