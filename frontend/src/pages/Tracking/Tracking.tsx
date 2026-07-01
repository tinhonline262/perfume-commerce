import React, { FC, ReactElement, useState, useEffect } from "react";
import { Form, Input, Button, Typography, Row, Col, Steps, Skeleton, Divider } from "antd";
import { SearchOutlined, InboxOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import RequestService from "../../utils/request-service";
import { OrderStatusBadge, PaymentStatusBadge } from "../../utils/statusUtils";
import { OrderItemResponse } from "../../types/types";
import { formatPrice } from "../../utils/formatPrice";
import "./Tracking.css";

const { Title, Text } = Typography;
const { Step } = Steps;

const Tracking: FC = (): ReactElement => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [orderItems, setOrderItems] = useState<OrderItemResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fetchOrderItems = async (orderId: string) => {
        try {
            const response = await RequestService.get(`/order/${orderId}/items`);
            if (response.data) {
                setOrderItems(response.data);
            }
        } catch (err) {
            console.error("Failed to fetch order items", err);
        }
    };

    const onSearch = async (values: { orderId: string }) => {
        if (!values.orderId) return;
        
        setLoading(true);
        setError(null);
        setOrder(null);
        setOrderItems([]);
        setHasSearched(true);
        
        try {
            const response = await RequestService.get(`/order/${values.orderId}`);
            setOrder(response.data);
            await fetchOrderItems(values.orderId);
        } catch (err: any) {
            setError(t('tracking.notFound', 'Order not found.'));
        } finally {
            setLoading(false);
        }
    };

    const getTimelineCurrent = (status: string) => {
        switch (status) {
            case "PENDING": return 0;
            case "PREPARING": return 1;
            case "READY_TO_SHIP": return 2;
            case "SHIPPING": return 3;
            case "DELIVERED": return 4;
            case "CANCELLED": return 0;
            default: return 0;
        }
    };

    const getTimelineStatus = (status: string) => {
        if (status === "CANCELLED") return "error";
        if (status === "DELIVERED") return "finish";
        return "process";
    };

    const renderTimeline = () => {
        if (!order) return null;
        
        const isCancelled = order.orderStatus === "CANCELLED";
        const current = getTimelineCurrent(order.orderStatus);
        const status = getTimelineStatus(order.orderStatus);

        if (isCancelled) {
            return (
                <div className="tracking-timeline-container tracking-cancelled">
                    <Steps current={0} status="error">
                            <Step 
                            title={t("tracking.status.cancelled", "Cancelled")} 
                            description={t("tracking.orderCancelledDesc", "This order has been cancelled.")}
                            icon={<CloseCircleOutlined />}
                        />
                    </Steps>
                </div>
            );
        }

        return (
            <div className="tracking-timeline-container">
                <Steps current={current} status={status as any} responsive={false}>
                    <Step title={t("tracking.status.pending", "Order Confirmed")} className="tracking-timeline-item" />
                    <Step title={t("tracking.status.preparing", "Preparing")} className="tracking-timeline-item" />
                    <Step title={t("tracking.status.readyToShip", "Ready to Ship")} className="tracking-timeline-item" />
                    <Step title={t("tracking.status.shipping", "Shipping")} className="tracking-timeline-item" />
                    <Step title={t("tracking.status.delivered", "Delivered")} className="tracking-timeline-item" />
                </Steps>
            </div>
        );
    };

    const calculateSubtotal = () => {
        if (orderItems && orderItems.length > 0) {
            return orderItems.reduce((acc, item) => acc + (item.perfume.price * item.quantity), 0);
        }
        return order ? order.totalPrice : 0;
    };

    const subtotal = calculateSubtotal();
    // Assuming shipping is free and no discount for simplicity unless provided by backend
    const shipping = 0; 
    const discount = 0;

    return (
        <div className="tracking-container">
            <div className="tracking-header">
                <Title level={1}>{t('tracking.title', 'Track Your Order')}</Title>
                <Text className="tracking-subtitle">
                    {t('tracking.subtitle', 'Enter your order ID to check the latest shipping status.')}
                </Text>
            </div>
            
            <div className="tracking-search-card">
                <Form onFinish={onSearch} layout="vertical">
                    <div className="tracking-search-input-wrapper">
                        <Form.Item 
                            name="orderId" 
                            style={{ marginBottom: 0, flex: 1 }}
                        >
                            <Input 
                                size="large" 
                                placeholder={t('tracking.searchPlaceholder', 'Order ID (e.g. #1024)')} 
                                prefix={<SearchOutlined style={{ color: "var(--color-text-secondary)", fontSize: "20px" }} />}
                            />
                        </Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            className="tracking-search-btn"
                            loading={loading}
                            icon={!loading && <SearchOutlined />}
                        >
                            {loading ? t('tracking.loading', 'Loading...') : t('tracking.searchButton', 'Track Order')}
                        </Button>
                    </div>
                </Form>
            </div>

            {loading && (
                <div className="tracking-result-card">
                    <Skeleton active avatar paragraph={{ rows: 4 }} />
                </div>
            )}

            {!loading && hasSearched && error && (
                <div className="tracking-result-card tracking-result-wrapper tracking-empty-state">
                    <InboxOutlined className="tracking-empty-icon" />
                    <Title level={3} className="tracking-empty-title">{t('tracking.notFoundTitle', 'Order not found')}</Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 24, fontSize: 16 }}>
                        {t('tracking.notFoundDesc', 'Please check your Order ID and try again.')}
                    </Text>
                    <Button type="primary" size="large" onClick={() => { setError(null); setHasSearched(false); }}>
                        {t('tracking.trackAnother', 'Track another order')}
                    </Button>
                </div>
            )}

            {!loading && hasSearched && order && !error && (
                <div className="tracking-result-card tracking-result-wrapper">
                    <div className="tracking-order-summary">
                        <Title level={3} className="tracking-order-id">
                            {t('tracking.order', 'Order')} #{order.id}
                        </Title>
                        <div style={{ textAlign: "right" }}>
                            <Text type="secondary" style={{ display: "block", fontSize: 14 }}>{t('tracking.date', 'Date')}</Text>
                            <Text strong style={{ fontSize: 16 }}>{order.date}</Text>
                        </div>
                    </div>
                    
                    <div className="tracking-customer-info">
                        <div className="tracking-info-item">
                            <h5>{t('tracking.customer', 'Customer')}</h5>
                            <p>{order.firstName} {order.lastName}</p>
                        </div>
                        <div className="tracking-info-item">
                            <h5>{t('tracking.paymentStatus', 'Payment Status')}</h5>
                            <p>
                                <PaymentStatusBadge status={order.paymentStatus} />
                            </p>
                        </div>
                        <div className="tracking-info-item">
                            <h5>{t('tracking.paymentMethod', 'Payment Method')}</h5>
                            <p>{order.paymentMethod || t('order.cod', 'COD')}</p>
                        </div>
                    </div>

                    {renderTimeline()}

                    {orderItems.length > 0 && (
                        <>
                            <Divider />
                            <Title level={4} className="tracking-products-title">
                                {t('tracking.items', 'Items in your order')}
                            </Title>
                            <div className="tracking-products-list">
                                {orderItems.map((item) => (
                                    <div key={item.id} className="tracking-product-item">
                                        <div className="tracking-product-image-container">
                                            {item.perfume.filename ? (
                                                <img 
                                                    src={item.perfume.filename} 
                                                    alt={item.perfume.perfumeTitle} 
                                                    className="tracking-product-img"
                                                />
                                            ) : (
                                                <div className="tracking-product-img-placeholder" />
                                            )}
                                        </div>
                                        <div className="tracking-product-info">
                                            <p className="tracking-product-name">{item.perfume.perfumeTitle}</p>
                                            <span className="tracking-product-brand">{item.perfume.perfumer}</span>
                                            <span className="tracking-product-volume">{item.perfume.volume} ml</span>
                                        </div>
                                        <div className="tracking-product-meta">
                                            <div className="tracking-product-meta-item">
                                                <span className="tracking-product-meta-label">{t('tracking.price', 'Price')}</span>
                                                <span className="tracking-product-price">{formatPrice(item.perfume.price)} {t('common.currency', 'VND')}</span>
                                            </div>
                                            <div className="tracking-product-meta-item">
                                                <span className="tracking-product-meta-label">{t('tracking.quantity', 'Qty')}</span>
                                                <span className="tracking-product-price">{item.quantity}</span>
                                            </div>
                                            <div className="tracking-product-meta-item">
                                                <span className="tracking-product-meta-label">{t('tracking.subtotal', 'Subtotal')}</span>
                                                <span className="tracking-product-price">{formatPrice(item.perfume.price * item.quantity)} {t('common.currency', 'VND')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="tracking-order-totals">
                                <div className="tracking-total-row">
                                    <span>{t('tracking.subtotal', 'Subtotal')}</span>
                                    <span>{formatPrice(subtotal)} {t('common.currency', 'VND')}</span>
                                </div>
                                <div className="tracking-total-row">
                                    <span>{t('tracking.shipping', 'Shipping')}</span>
                                    <span>{shipping === 0 ? t('tracking.free', 'Free') : `${formatPrice(shipping)} ${t('common.currency', 'VND')}`}</span>
                                </div>
                                <div className="tracking-total-row">
                                    <span>{t('tracking.discount', 'Discount')}</span>
                                    <span>{formatPrice(discount)} {t('common.currency', 'VND')}</span>
                                </div>
                                <div className="tracking-total-row tracking-total-final">
                                    <span>{t('tracking.total', 'Total')}</span>
                                    <span>{formatPrice(order.totalPrice)} {t('common.currency', 'VND')}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {!loading && !hasSearched && (
                <div className="tracking-empty-state">
                    <SearchOutlined className="tracking-empty-icon" />
                    <Title level={3} className="tracking-empty-title">{t('tracking.title', 'Track Your Order')}</Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                        {t('tracking.subtitle', 'Enter your order ID to check the latest shipping status.')}
                    </Text>
                </div>
            )}
        </div>
    );
};

export default Tracking;
