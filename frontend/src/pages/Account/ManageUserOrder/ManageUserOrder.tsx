import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Card, Col, Row, Table } from "antd";
import { InfoCircleOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import {
    selectIsOrderLoaded,
    selectIsOrderLoading,
    selectOrder,
    selectOrderItems
} from "../../../redux-toolkit/order/order-selector";
import { fetchOrderById, fetchOrderItemsByOrderId } from "../../../redux-toolkit/order/order-thunks";
import { resetOrderState } from "../../../redux-toolkit/order/order-slice";
import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import Spinner from "../../../components/Spinner/Spinner";
import AccountDataItem from "../../../components/AccountDataItem/AccountDataItem";
import { OrderItemResponse } from "../../../types/types";
import "./ManageUserOrder.css";

const ManageUserOrder: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const params = useParams<{ id: string }>();
    const order = useSelector(selectOrder);
    const orderItems = useSelector(selectOrderItems);
    const isOrderLoading = useSelector(selectIsOrderLoading);
    const isOrderLoaded = useSelector(selectIsOrderLoaded);
    const { id, email, firstName, lastName, totalPrice, postIndex, phoneNumber, date, city, address, paymentStatus } = order;

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
                                        <AccountDataItem title={t('account.order_status')} text={paymentStatus || "N/A"} />
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
