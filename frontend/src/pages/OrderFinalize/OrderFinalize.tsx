import React, { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CircleCheck, Package, Truck, Mail, ShoppingBag, ArrowRight } from "lucide-react";

import { selectOrder } from "../../redux-toolkit/order/order-selector";
import { resetCartState } from "../../redux-toolkit/cart/cart-slice";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import { BASE, MENU, TRACKING } from "../../constants/routeConstants";
import { formatPrice } from "../../utils/formatPrice";
import RequestService from "../../utils/request-service";
import "./OrderFinalize.css";

const OrderFinalize: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const location = useLocation();
    
    // Order from Redux state (used immediately after COD checkout)
    const orderFromState = useSelector(selectOrder);
    
    // Local state for fetched order (used after VNPay redirect)
    const [fetchedOrder, setFetchedOrder] = useState<any>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Combine order sources, preferring fetched data if available
    const order = fetchedOrder || orderFromState;

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(resetCartState());
        
        // Parse orderId from query params (e.g. ?orderId=26 from VNPay callback)
        const params = new URLSearchParams(location.search);
        const urlOrderId = params.get("orderId");
        
        const fetchOrderData = async (id: string | number) => {
            try {
                // Only fetch order if we don't have it from Redux or if URL explicitly tells us which one
                if (urlOrderId) {
                    const orderRes = await RequestService.get(`/order/${id}`);
                    if (orderRes.data) {
                        setFetchedOrder(orderRes.data);
                    }
                }
                
                const itemsRes = await RequestService.get(`/order/${id}/items`);
                if (itemsRes.data) {
                    setOrderItems(itemsRes.data);
                }
            } catch (err) {
                console.error("Failed to fetch order details", err);
            } finally {
                setIsLoading(false);
            }
        };

        const targetOrderId = urlOrderId || (orderFromState && orderFromState.id);
        
        if (targetOrderId) {
            fetchOrderData(targetOrderId);
        } else {
            setIsLoading(false);
        }
    }, [dispatch, location.search, orderFromState]);

    const calculateSubtotal = () => {
        if (orderItems.length > 0) {
            return orderItems.reduce((sum, item) => sum + (item.perfume.price * item.quantity), 0);
        }
        return order?.totalPrice || 0;
    };

    if (isLoading) {
        return (
            <ContentWrapper>
                <div className="finalize-container" style={{ textAlign: "center", padding: "100px 0" }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">{t('order.processing', 'Processing...')}</span>
                    </div>
                </div>
            </ContentWrapper>
        );
    }

    // Defensive check
    if (!order || !order.id) {
        return (
            <ContentWrapper>
                <div className="finalize-container" style={{ textAlign: "center", padding: "100px 0" }}>
                    <h1 className="finalize-title">{t('tracking.notFoundTitle', 'Order not found')}</h1>
                    <p style={{ marginBottom: "24px" }}>We couldn't retrieve your order details.</p>
                    <Link to={MENU} className="finalize-btn finalize-btn-primary" style={{ display: "inline-flex", width: "auto" }}>
                        <ShoppingBag size={18} /> {t('order.finalize.continueShopping')}
                    </Link>
                </div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper>
            <div className="finalize-container">
                <div className="finalize-card">
                    
                    <div className="finalize-header">
                        <div className="finalize-icon-wrapper">
                            <CircleCheck size={40} strokeWidth={2} />
                        </div>
                        <h1 className="finalize-title">{t('order.finalize.title')}</h1>
                        <p className="finalize-subtitle">
                            {t('order.finalize.subtitle')}<br />
                            {t('order.finalize.description')}
                        </p>
                    </div>

                    <div className="finalize-highlights">
                        <div className="finalize-highlight-card">
                            <Package size={24} className="finalize-highlight-icon" />
                            <div>
                                <div className="finalize-highlight-label">{t('order.finalize.orderNumber')}</div>
                                <div className="finalize-highlight-value">#{order.id}</div>
                            </div>
                        </div>
                        <div className="finalize-highlight-card">
                            <Mail size={24} className="finalize-highlight-icon" />
                            <div>
                                <div className="finalize-highlight-label">{t('order.finalize.confirmationEmail')}</div>
                                <div className="finalize-highlight-value">{order.email || t('order.finalize.description').split('.')[1]?.trim() || t('order.finalize.confirmationEmail')}</div>
                            </div>
                        </div>
                        <div className="finalize-highlight-card">
                            <Truck size={24} className="finalize-highlight-icon" />
                            <div>
                                <div className="finalize-highlight-label">{t('order.finalize.deliveryEstimate')}</div>
                                <div className="finalize-highlight-value">{t('order.finalize.deliveryTime')}</div>
                            </div>
                        </div>
                    </div>

                    {orderItems.length > 0 && (
                        <div className="finalize-summary">
                            <h2 className="finalize-summary-title">{t('order.finalize.summary')}</h2>
                            
                            <div className="finalize-items">
                                {orderItems.map((item, index) => (
                                    <div key={index} className="finalize-item">
                                        <div className="finalize-item-image">
                                            <img src={item.perfume.filename} alt={item.perfume.perfumeTitle} />
                                        </div>
                                        <div className="finalize-item-details">
                                            <h3 className="finalize-item-name">{item.perfume.perfumer} - {item.perfume.perfumeTitle}</h3>
                                            <div className="finalize-item-meta">{item.perfume.volume} ml</div>
                                        </div>
                                        <div className="finalize-item-price-wrapper">
                                            <div className="finalize-item-price">{formatPrice(item.perfume.price)} {t('common.currency', 'VND')}</div>
                                            <div className="finalize-item-qty">{t('order.finalize.qty')}: {item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="finalize-totals">
                                <div className="finalize-total-row">
                                    <span>{t('order.finalize.subtotal')}</span>
                                    <span>{formatPrice(calculateSubtotal())} {t('common.currency', 'VND')}</span>
                                </div>
                                <div className="finalize-total-row">
                                    <span>{t('order.finalize.shipping')}</span>
                                    <span>{t('order.finalize.free')}</span>
                                </div>
                                <div className="finalize-total-row">
                                    <span>{t('order.finalize.discount')}</span>
                                    <span>0 {t('common.currency', 'VND')}</span>
                                </div>
                                <div className="finalize-total-final">
                                    <span>{t('order.finalize.total')}</span>
                                    <span>{formatPrice(order.totalPrice)} {t('common.currency', 'VND')}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="finalize-actions">
                        <Link to={TRACKING} className="finalize-btn finalize-btn-secondary">
                            <Package size={18} /> {t('order.finalize.trackOrder')}
                        </Link>
                        <Link to={MENU} className="finalize-btn finalize-btn-primary">
                            <ShoppingBag size={18} /> {t('order.finalize.continueShopping')}
                        </Link>
                    </div>

                </div>
            </div>
        </ContentWrapper>
    );
};

export default OrderFinalize;