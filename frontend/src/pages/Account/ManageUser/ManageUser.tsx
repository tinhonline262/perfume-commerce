import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Table } from "antd";
import { useTranslation } from "react-i18next";

import { selectAdminStateUser, selectIsAdminStateLoading } from "../../../redux-toolkit/admin/admin-selector";
import { selectOrders, selectTotalElements } from "../../../redux-toolkit/orders/orders-selector";
import { fetchUserInfo } from "../../../redux-toolkit/admin/admin-thunks";
import { resetOrders } from "../../../redux-toolkit/orders/orders-slice";
import { resetAdminState } from "../../../redux-toolkit/admin/admin-slice";
import { LoadingStatus, OrderResponse, UserOrdersRequest } from "../../../types/types";
import { fetchUserOrdersByEmail } from "../../../redux-toolkit/orders/orders-thunks";
import Spinner from "../../../components/Spinner/Spinner";
import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import AccountDataItem from "../../../components/AccountDataItem/AccountDataItem";
import { ACCOUNT_USER_ORDERS } from "../../../constants/routeConstants";
import { useTablePagination } from "../../../hooks/useTablePagination";

const ManageUser: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const params = useParams<{ id: string }>();
    const userData = useSelector(selectAdminStateUser);
    const userOrders = useSelector(selectOrders);
    const totalElements = useSelector(selectTotalElements);
    const isUserLoading = useSelector(selectIsAdminStateLoading);
    const handleTableChange = useTablePagination<OrderResponse, UserOrdersRequest>(fetchUserOrdersByEmail, userData.email!);
    const { id, email, firstName, lastName, city, address, phoneNumber, postIndex, provider, roles } = userData;

    useEffect(() => {
        dispatch(fetchUserInfo(params.id));

        return () => {
            dispatch(resetOrders());
            dispatch(resetAdminState(LoadingStatus.LOADING));
        };
    }, []);

    useEffect(() => {
        if (userData.email) {
            dispatch(fetchUserOrdersByEmail({ email: userData.email!, page: 0 }));
        }
    }, [userData]);

    return (
        <div className="account-section-card">
            {isUserLoading ? (
                <Spinner />
            ) : (
                <>
                    <ContentTitle title={`User: ${firstName} ${lastName}`} titleLevel={4} icon={<UserOutlined />} />
                    <Row style={{ marginTop: 32 }}>
                        <Col xs={24} sm={24}>
                            <div style={{ padding: "0" }}>
                                <Row gutter={24}>
                                    <Col xs={24} md={12}>
                                        <AccountDataItem title={"User id"} text={id} />
                                        <AccountDataItem title={t('auth.email')} text={email} />
                                        <AccountDataItem title={t('account.admin.role')} text={roles} />
                                        <AccountDataItem title={t('auth.first_name')} text={firstName} />
                                        <AccountDataItem title={t('auth.last_name')} text={lastName} />
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <AccountDataItem title={t('account.admin.provider')} text={provider} />
                                        <AccountDataItem title={t('order.city').replace(":", "")} text={city} />
                                        <AccountDataItem title={t('order.address').replace(":", "")} text={address} />
                                        <AccountDataItem title={t('order.mobile').replace(":", "")} text={phoneNumber} />
                                        <AccountDataItem title={t('order.index').replace(":", "")} text={postIndex} />
                                    </Col>
                                </Row>
                            </div>
                            <Row style={{ marginTop: 16 }}>
                                <Col xs={24} sm={24}>
                                    {userOrders.length === 0 ? (
                                        <div style={{ textAlign: "center" }}>
                                            <ContentTitle title={t('account.no_orders')} titleLevel={4} />
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ textAlign: "center" }}>
                                                <ContentTitle title={t('account.orders')} titleLevel={4} />
                                            </div>
                                            <Table
                                                rowKey={"id"}
                                                onChange={handleTableChange}
                                                pagination={{
                                                    total: totalElements,
                                                    position: ["bottomRight", "topRight"]
                                                }}
                                                dataSource={userOrders}
                                                columns={[
                                                    {
                                                        title: t('account.order_id'),
                                                        dataIndex: "id",
                                                        key: "id"
                                                    },
                                                    {
                                                        title: t('account.order_date'),
                                                        dataIndex: "date",
                                                        key: "date"
                                                    },
                                                    {
                                                        title: t('order.city').replace(":", ""),
                                                        dataIndex: "city",
                                                        key: "city"
                                                    },
                                                    {
                                                        title: t('order.address').replace(":", ""),
                                                        dataIndex: "address",
                                                        key: "address"
                                                    },
                                                    {
                                                        title: t('order.index').replace(":", ""),
                                                        dataIndex: "postIndex",
                                                        key: "postIndex"
                                                    },
                                                    {
                                                        title: t('order.order_summary'),
                                                        dataIndex: "totalPrice",
                                                        key: "totalPrice",
                                                        render: (_, order: OrderResponse) => `${order.totalPrice}.0 $`
                                                    },
                                                    {
                                                        title: t('account.actions'),
                                                        dataIndex: "actions",
                                                        key: "actions",
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
                                                                {t('account.details')}
                                                            </Link>
                                                        )
                                                    }
                                                ]}
                                            />
                                        </>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default ManageUser;
