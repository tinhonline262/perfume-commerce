import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Col, Row, Table, Select, message, Tag, Space, Typography } from "antd";
import { InfoCircleOutlined, ShoppingOutlined, SwapOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import {
    selectIsOrderLoaded,
    selectIsOrderLoading,
    selectOrder,
    selectOrderItems,
    selectStatusUpdateLoading
} from "../../../redux-toolkit/order/order-selector";
import { fetchOrderById, fetchOrderItemsByOrderId, updateOrderStatus } from "../../../redux-toolkit/order/order-thunks";
import { resetOrderState } from "../../../redux-toolkit/order/order-slice";
import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import Spinner from "../../../components/Spinner/Spinner";
import AccountDataItem from "../../../components/AccountDataItem/AccountDataItem";
import { OrderItemResponse } from "../../../types/types";
import { selectUserFromUserState } from "../../../redux-toolkit/user/user-selector";
import { UserRoles } from "../../../types/types";
import { OrderStatusBadge, PaymentStatusBadge, getOrderStatusLabel, getOrderStatusColor } from "../../../utils/statusUtils";
import "./ManageUserOrder.css";

const { Option } = Select;
const { Text } = Typography;

const TERMINAL_STATUSES = ["DELIVERED", "CANCELLED"];

const NEXT_STATUSES: Record<string, string[]> = {
    PENDING:       ["PREPARING", "CANCELLED"],
    PREPARING:     ["READY_TO_SHIP", "CANCELLED"],
    READY_TO_SHIP: ["SHIPPING", "CANCELLED"],
    SHIPPING:      ["DELIVERED"]
};

const ManageUserOrder: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const params = useParams<{ id: string }>();
    const order = useSelector(selectOrder);
    const orderItems = useSelector(selectOrderItems);
    const isOrderLoading = useSelector(selectIsOrderLoading);
    const isOrderLoaded = useSelector(selectIsOrderLoaded);
    const isStatusUpdating = useSelector(selectStatusUpdateLoading);
    const currentUser = useSelector(selectUserFromUserState);
    const isAdmin = currentUser?.roles?.includes(UserRoles.ADMIN);

    const { id, email, firstName, lastName, totalPrice, postIndex, phoneNumber, date, city, address, paymentStatus, orderStatus } = order;

    useEffect(() => {
        dispatch(fetchOrderById(params.id));

        return () => {
            dispatch(resetOrderState());
        };
    }, []);

    useEffect(() => {
        if (isOrderLoaded) {
            dispatch(fetchOrderItemsByOrderId(params.id));
        }
    }, [isOrderLoaded]);

    const handleStatusChange = async (newStatus: string) => {
        const result = await dispatch(updateOrderStatus({ orderId: id!, status: newStatus }) as any);
        if (updateOrderStatus.fulfilled.match(result)) {
            message.success(`Order status updated to ${newStatus}`);
        } else {
            message.error(result.payload || "Failed to update order status");
        }
    };

    const currentStatus = orderStatus || "";
    const isTerminal = TERMINAL_STATUSES.includes(currentStatus);
    const nextStatuses = NEXT_STATUSES[currentStatus] || [];

    return (
        <div className="account-section-card">
            {isOrderLoading ? (
                <Spinner />
            ) : (
                <>
                    <ContentTitle title={`${t('account.order_id')} ${id}`} titleLevel={4} icon={<ShoppingOutlined />} />
                    <Row style={{ marginTop: 32 }}>
                        <Col xs={24} sm={24}>
                            <div style={{ padding: 0 }}>
                                <Row gutter={32}>
                                    <Col xs={24} md={12}>
                                        <InfoCircleOutlined className={"manage-user-icon"} />
                                        <ContentTitle title={t('account.customer_info', 'Customer information')} titleLevel={5} />
                                        <AccountDataItem title={t('auth.first_name')} text={firstName} />
                                        <AccountDataItem title={t('auth.last_name')} text={lastName} />
                                        <AccountDataItem title={t('order.city').replace(":", "")} text={city} />
                                        <AccountDataItem title={t('order.address').replace(":", "")} text={address} />
                                        <AccountDataItem title={t('order.email').replace(":", "")} text={email} />
                                        <AccountDataItem title={t('order.mobile').replace(":", "")} text={phoneNumber} />
                                        <AccountDataItem title={t('order.index').replace(":", "")} text={postIndex} />
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <InfoCircleOutlined className={"manage-user-icon"} />
                                        <ContentTitle title={t('account.order_info', 'Order information')} titleLevel={5} />
                                        <AccountDataItem title={t('account.order_id')} text={id} />
                                        <AccountDataItem title={t('account.order_date')} text={date} />

                                        {/* Status display */}
                                        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                                            <Text strong>{t('account.order_status', 'Order Status')}:</Text>
                                            <OrderStatusBadge status={currentStatus} />
                                        </div>

                                        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                                            <Text strong>{t('account.payment_status', 'Payment Status')}:</Text>
                                            <PaymentStatusBadge status={paymentStatus} />
                                        </div>

                                        {/* Admin status update controls */}
                                        {isAdmin && !isTerminal && nextStatuses.length > 0 && (
                                            <div style={{ marginBottom: 16 }}>
                                                <Space align="center">
                                                    <SwapOutlined style={{ color: "#1890ff" }} />
                                                    <Text strong>Update status:</Text>
                                                    <Select
                                                        placeholder="Change status"
                                                        style={{ minWidth: 160 }}
                                                        loading={isStatusUpdating}
                                                        disabled={isStatusUpdating}
                                                        onChange={handleStatusChange}
                                                    >
                                                        {nextStatuses.map((s) => (
                                                            <Option key={s} value={s}>
                                                                <span style={{ color: getOrderStatusColor(s) }}>
                                                                    {getOrderStatusLabel(s, t)}
                                                                </span>
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Space>
                                            </div>
                                        )}

                                        {isAdmin && isTerminal && (
                                            <div style={{ marginBottom: 16 }}>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    This order is in a terminal state and cannot be updated.
                                                </Text>
                                            </div>
                                        )}

                                        <ContentTitle title={`${t('order.order_summary')}: ${totalPrice} VND`} titleLevel={4} />
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 16 }}>
                                    <Col xs={24} sm={24}>
                                        <Table
                                            rowKey={"id"}
                                            pagination={false}
                                            dataSource={orderItems}
                                            columns={[
                                                {
                                                    title: "Id",
                                                    dataIndex: "id",
                                                    key: "id"
                                                },
                                                {
                                                    title: t('menu.perfumer'),
                                                    dataIndex: "perfumer",
                                                    key: "perfumer",
                                                    render: (_, order: OrderItemResponse) => order.perfume.perfumer
                                                },
                                                {
                                                    title: t('product.perfumer').replace('Perfumer', 'Name'),
                                                    dataIndex: "perfumeTitle",
                                                    key: "perfumeTitle",
                                                    render: (_, order: OrderItemResponse) => order.perfume.perfumeTitle
                                                },
                                                {
                                                    title: t('cart.quantity'),
                                                    dataIndex: "quantity",
                                                    key: "quantity"
                                                },
                                                {
                                                    title: t('menu.price'),
                                                    dataIndex: "price",
                                                    key: "price",
                                                    render: (_, order: OrderItemResponse) => `${order.perfume.price} VND`
                                                },
                                                {
                                                    title: t('cart.total'),
                                                    dataIndex: "amount",
                                                    key: "amount",
                                                    render: (_, order: OrderItemResponse) => `${order.amount} VND`
                                                }
                                            ]}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default ManageUserOrder;
