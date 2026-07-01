import React, { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Form, Radio } from "antd";
import { useTranslation } from "react-i18next";
import { PackageCheck, CreditCard, Banknote, ShieldCheck } from "lucide-react";

import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import FormInput from "../../components/FormInput/FormInput";
import { selectUserFromUserState } from "../../redux-toolkit/user/user-selector";
import { selectCartItems, selectTotalPrice } from "../../redux-toolkit/cart/cart-selector";
import { selectIsOrderLoading, selectOrderErrors } from "../../redux-toolkit/order/order-selector";
import { resetOrderState, setOrderLoadingState } from "../../redux-toolkit/order/order-slice";
import { LoadingStatus } from "../../types/types";
import { addOrder } from "../../redux-toolkit/order/order-thunks";
import { calculateCartPrice } from "../../redux-toolkit/cart/cart-slice";
import { fetchCart } from "../../redux-toolkit/cart/cart-thunks";
import { formatPrice } from "../../utils/formatPrice";
import "./Order.css";

interface OrderFormData {
    firstName: string;
    lastName: string;
    city: string;
    address: string;
    phoneNumber: string;
    postIndex: string;
    email: string;
    paymentMethod: string;
}

const Order: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const usersData = useSelector(selectUserFromUserState);
    const perfumes = useSelector(selectCartItems);
    const totalPrice = useSelector(selectTotalPrice);
    const errors = useSelector(selectOrderErrors);
    const isOrderLoading = useSelector(selectIsOrderLoading);
    
    const [perfumesFromLocalStorage, setPerfumesFromLocalStorage] = useState<Map<number, number>>(new Map());
    const [paymentMethod, setPaymentMethod] = useState<string>("COD");

    useEffect(() => {
        dispatch(calculateCartPrice(perfumes));
    }, [perfumes, dispatch]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const perfumesString = localStorage.getItem("perfumes");
        let perfumesMap: Map<number, number> = new Map();
        if (perfumesString) {
            try {
                perfumesMap = new Map(JSON.parse(perfumesString));
            } catch (e) {
                console.error("Failed to parse perfumes from local storage", e);
            }
        }
        setPerfumesFromLocalStorage(perfumesMap);
        dispatch(setOrderLoadingState(LoadingStatus.LOADED));
        dispatch(fetchCart(Array.from(perfumesMap.keys())));

        if (usersData) {
            form.setFieldsValue(usersData);
        }
        form.setFieldsValue({ paymentMethod: "COD" });

        return () => {
            dispatch(resetOrderState());
        };
    }, [dispatch, form, usersData]);

    const onFormSubmit = (order: OrderFormData): void => {
        let perfumesId = {};
        const perfumesString = localStorage.getItem("perfumes");
        if (perfumesString) {
            let perfumesIdMap = new Map();
            try {
                perfumesIdMap = new Map(JSON.parse(perfumesString));
            } catch(e) {
                console.error("error", e);
            }
            perfumesId = Object.fromEntries(perfumesIdMap);
        }
        
        dispatch(addOrder({ order: { ...order, perfumesId, totalPrice, paymentMethod }, history }));
        localStorage.removeItem("perfumes");
    };

    return (
        <ContentWrapper>
            <div className="checkout-container">
                <div className="checkout-header">
                    <h1 className="checkout-title">{t('cart.checkout')}</h1>
                </div>

                <Form onFinish={onFormSubmit} form={form} initialValues={{ paymentMethod: "COD" }} layout="vertical">
                    <div className="checkout-layout">
                        <div className="checkout-form-section">
                            <h2 className="checkout-section-title">{t('order.shipping_details')}</h2>
                            
                            <div className="checkout-form-grid">
                                <div className="checkout-form-full">
                                    <FormInput
                                        title={t('order.email')}
                                        name="email"
                                        error={errors.emailError ? t(`errors.${errors.emailError}`) : undefined}
                                        disabled={isOrderLoading}
                                        placeholder={t('order.placeholders.email')}
                                    />
                                </div>
                                
                                <div>
                                    <FormInput
                                        title={t('order.name')}
                                        name="firstName"
                                        error={errors.firstNameError ? t(`errors.${errors.firstNameError}`) : undefined}
                                        disabled={isOrderLoading}
                                        placeholder={t('order.placeholders.first_name')}
                                    />
                                </div>
                                <div>
                                    <FormInput
                                        title={t('order.surname')}
                                        name="lastName"
                                        error={errors.lastNameError ? t(`errors.${errors.lastNameError}`) : undefined}
                                        disabled={isOrderLoading}
                                        placeholder={t('order.placeholders.last_name')}
                                    />
                                </div>

                                <div className="checkout-form-full">
                                    <FormInput
                                        title={t('order.address')}
                                        name="address"
                                        error={errors.addressError ? t(`errors.${errors.addressError}`) : undefined}
                                        disabled={isOrderLoading}
                                        placeholder={t('order.placeholders.address')}
                                    />
                                </div>

                                <div>
                                    <FormInput
                                        title={t('order.city')}
                                        name="city"
                                        error={errors.cityError ? t(`errors.${errors.cityError}`) : undefined}
                                        disabled={isOrderLoading}
                                        placeholder={t('order.placeholders.city')}
                                    />
                                </div>
                                <div>
                                    <FormInput
                                        title={t('order.index')}
                                        name="postIndex"
                                        error={errors.postIndexError ? t(`errors.${errors.postIndexError}`) : undefined}
                                        disabled={isOrderLoading}
                                        placeholder={t('order.placeholders.index')}
                                    />
                                </div>

                                <div className="checkout-form-full">
                                    <FormInput
                                        title={t('order.mobile')}
                                        name="phoneNumber"
                                        error={errors.phoneNumberError ? t(`errors.${errors.phoneNumberError}`) : undefined}
                                        disabled={isOrderLoading}
                                        placeholder={t('order.placeholders.mobile')}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="checkout-summary-section">
                            <div className="checkout-summary-card">
                                <h2 className="checkout-section-title" style={{ borderBottom: 'none', marginBottom: '16px' }}>
                                    {t('order.order_summary')}
                                </h2>
                                
                                <div className="checkout-items-list">
                                    {perfumes.map((perfume) => (
                                        <div className="checkout-item" key={perfume.id}>
                                            <div className="checkout-item-image">
                                                <img src={perfume.filename} alt={perfume.perfumeTitle} />
                                                <span className="checkout-item-qty">
                                                    {perfumesFromLocalStorage.get(perfume.id) || 1}
                                                </span>
                                            </div>
                                            <div className="checkout-item-info">
                                                <h4 className="checkout-item-title">{perfume.perfumer} - {perfume.perfumeTitle}</h4>
                                                <span className="checkout-item-volume">{perfume.volume} ml</span>
                                            </div>
                                            <div className="checkout-item-price">
                                                {formatPrice(perfume.price * (perfumesFromLocalStorage.get(perfume.id) || 1))} {t('common.currency', 'VND')}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="checkout-totals">
                                    <div className="checkout-total-row">
                                        <span>{t('cart.subtotal')}</span>
                                        <span>{formatPrice(totalPrice)} {t('common.currency', 'VND')}</span>
                                    </div>
                                    <div className="checkout-total-row">
                                        <span>{t('cart.estimated_shipping')}</span>
                                        <span>{t('cart.free')}</span>
                                    </div>
                                    
                                    <div className="checkout-payment-methods">
                                        <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px', color: 'var(--color-text-primary)' }}>
                                            {t('order.payment_method')}
                                        </h3>
                                        <Form.Item name="paymentMethod" style={{ marginBottom: 0 }}>
                                            <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} className="payment-radio-group">
                                                <Radio value="COD" className="payment-method-card">
                                                    <div className="payment-method-content">
                                                        <Banknote size={20} className="payment-method-icon" />
                                                        <div className="payment-method-details">
                                                            <span className="payment-method-title">{t('order.cod')}</span>
                                                            <span className="payment-method-desc">{t('order.cod_desc', 'Pay when you receive')}</span>
                                                        </div>
                                                    </div>
                                                </Radio>
                                                <Radio value="VNPAY" className="payment-method-card">
                                                    <div className="payment-method-content">
                                                        <CreditCard size={20} className="payment-method-icon" />
                                                        <div className="payment-method-details">
                                                            <span className="payment-method-title">{t('order.vnpay')}</span>
                                                            <span className="payment-method-desc">{t('order.vnpay_desc', 'Secure online payment')}</span>
                                                        </div>
                                                    </div>
                                                </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </div>

                                    <div className="checkout-total-final">
                                        <span>{t('cart.total')}</span>
                                        <span>{formatPrice(totalPrice)} {t('common.currency', 'VND')}</span>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="checkout-submit-btn"
                                        disabled={isOrderLoading}
                                    >
                                        {isOrderLoading ? t('order.processing', 'Processing...') : (
                                            <>
                                                <ShieldCheck size={20} />
                                                {t('order.validate_order')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        </ContentWrapper>
    );
};

export default Order;