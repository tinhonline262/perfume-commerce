import React, { FC, ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Select, message } from "antd";
import { AsyncThunk } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";

import { HeaderResponse, OrderResponse } from "../../types/types";
import { ACCOUNT_USER_ORDERS } from "../../constants/routeConstants";
import { selectTotalElements } from "../../redux-toolkit/orders/orders-selector";
import { useTablePagination } from "../../hooks/useTablePagination";
import { updateOrderStatus } from "../../redux-toolkit/order/order-thunks";
import { OrderStatusBadge, PaymentStatusBadge, getOrderStatusLabel, getOrderStatusColor } from "../../utils/statusUtils";

const { Option } = Select;

type PropsType = {
    orders: Array<OrderResponse>;
    loading: boolean;
    fetchOrders: AsyncThunk<HeaderResponse<OrderResponse>, number, {}>;
    isAdmin?: boolean;
};

const TERMINAL_STATUSES = ["DELIVERED", "CANCELLED"];

const NEXT_STATUSES: Record<string, string[]> = {
    PENDING:       ["PREPARING", "CANCELLED"],
    PREPARING:     ["READY_TO_SHIP", "CANCELLED"],
    READY_TO_SHIP: ["SHIPPING", "CANCELLED"],
    SHIPPING:      ["DELIVERED"]
};

const OrdersTable: FC<PropsType> = ({ orders, loading, fetchOrders, isAdmin = false }): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const totalElements = useSelector(selectTotalElements);
    const handleTableChange = useTablePagination<OrderResponse, number>(fetchOrders);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        const result = await dispatch(updateOrderStatus({ orderId, status: newStatus }) as any);
        if (updateOrderStatus.fulfilled.match(result)) {
            message.success(`Order #${orderId} updated to ${newStatus}`);
        } else {
            message.error(result.payload || "Failed to update order status");
        }
    };

    const renderStatus = (status: string, order: OrderResponse) => {
        const isTerminal = TERMINAL_STATUSES.includes(status);
        const nextStatuses = NEXT_STATUSES[status] || [];

        if (isAdmin && !isTerminal && nextStatuses.length > 0) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                    <Select
                        value={status}
                        size="small"
                        style={{ minWidth: 140 }}
                        dropdownMatchSelectWidth={false}
                        bordered={false}
                        onChange={(val) => handleStatusChange(order.id, val)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Option value={status} disabled>
                            <span style={{ color: getOrderStatusColor(status), fontWeight: 600 }}>
                                {getOrderStatusLabel(status, t)}
                            </span>
                        </Option>
                        {nextStatuses.map((s) => (
                            <Option key={s} value={s}>
                                <span style={{ color: getOrderStatusColor(s) }}>
                                    {getOrderStatusLabel(s, t)}
                                </span>
                            </Option>
                        ))}
                    </Select>
                </div>
            );
        }

        return <OrderStatusBadge status={status} />;
    };

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
                    title: t('account.order_total', 'Sum'),
                    dataIndex: "totalPrice",
                    key: "totalPrice",
                    sorter: (a, b) => a.totalPrice - b.totalPrice
                },
                {
                    title: t('account.order_status', 'Order Status'),
                    dataIndex: "orderStatus",
                    key: "orderStatus",
                    render: (status: string, order: OrderResponse) => renderStatus(status, order)
                },
                {
                    title: t('account.payment_status', 'Payment'),
                    dataIndex: "paymentStatus",
                    key: "paymentStatus",
                    render: (status: string) => <PaymentStatusBadge status={status} />
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
