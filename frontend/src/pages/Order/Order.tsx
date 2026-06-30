import React, {FC, ReactElement, useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { CheckCircleOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Typography, Radio } from "antd";
import { useTranslation } from "react-i18next";

import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import ContentTitle from "../../components/ContentTitle/ContentTitle";
import FormInput from "../../components/FormInput/FormInput";
import { selectUserFromUserState } from "../../redux-toolkit/user/user-selector";
import {selectCartItems, selectTotalPrice} from "../../redux-toolkit/cart/cart-selector";
import { selectIsOrderLoading, selectOrderErrors } from "../../redux-toolkit/order/order-selector";
import { resetOrderState, setOrderLoadingState } from "../../redux-toolkit/order/order-slice";
import { LoadingStatus } from "../../types/types";
import { addOrder } from "../../redux-toolkit/order/order-thunks";
import {resetCartState} from "../../redux-toolkit/cart/cart-slice";
import {fetchCart} from "../../redux-toolkit/cart/cart-thunks";
import OrderItem from "./OrderItem/OrderItem";

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
        const perfumesFromLocalStorage: Map<number, number> = new Map(
            JSON.parse(localStorage.getItem("perfumes") as string)
        );
        setPerfumesFromLocalStorage(perfumesFromLocalStorage);
        dispatch(setOrderLoadingState(LoadingStatus.LOADED));
        dispatch(fetchCart(Array.from(perfumesFromLocalStorage.keys())));

        if (usersData) {
            form.setFieldsValue(usersData);
        }
        form.setFieldsValue({ paymentMethod: "COD" });

        return () => {
            dispatch(resetOrderState());
        };
    }, []);

    const onFormSubmit = (order: OrderFormData): void => {
        const perfumesId = Object.fromEntries(new Map(JSON.parse(localStorage.getItem("perfumes") as string)));
        
        // Pass paymentMethod from state since order param might not have the updated value from Form.Item correctly mapped if it doesn't trigger onFinish
        dispatch(addOrder({ order: { ...order, perfumesId, totalPrice, paymentMethod }, history }));
    };

    return (
        <ContentWrapper>
            <div style={{ textAlign: "center" }}>
                <ContentTitle icon={<ShoppingOutlined />} title={t('order.title')} />
            </div>
            <Form onFinish={onFormSubmit} form={form} initialValues={{ paymentMethod: "COD" }}>
                <Row gutter={32}>
                    <Col xs={24} md={12}>
                        <div style={{ marginBottom: 24 }}>
                            <Typography.Title level={4} style={{ marginBottom: 24, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                {t('order.shipping_details')}
                            </Typography.Title>
                            <FormInput
                                title={t('order.name')}
                                titleSpan={5}
                                wrapperSpan={19}
                                name={"firstName"}
                                error={errors.firstNameError ? t(`errors.${errors.firstNameError}`) : undefined}
                                disabled={isOrderLoading}
                                placeholder={t('order.placeholders.first_name')}
                            />
                            <FormInput
                                title={t('order.surname')}
                                titleSpan={5}
                                wrapperSpan={19}
                                name={"lastName"}
                                error={errors.lastNameError ? t(`errors.${errors.lastNameError}`) : undefined}
                                disabled={isOrderLoading}
                                placeholder={t('order.placeholders.last_name')}
                            />
                            <FormInput
                                title={t('order.city')}
                                titleSpan={5}
                                wrapperSpan={19}
                                name={"city"}
                                error={errors.cityError ? t(`errors.${errors.cityError}`) : undefined}
                                disabled={isOrderLoading}
                                placeholder={t('order.placeholders.city')}
                            />
                            <FormInput
                                title={t('order.address')}
                                titleSpan={5}
                                wrapperSpan={19}
                                name={"address"}
                                error={errors.addressError ? t(`errors.${errors.addressError}`) : undefined}
                                disabled={isOrderLoading}
                                placeholder={t('order.placeholders.address')}
                            />
                            <FormInput
                                title={t('order.index')}
                                titleSpan={5}
                                wrapperSpan={19}
                                name={"postIndex"}
                                error={errors.postIndexError ? t(`errors.${errors.postIndexError}`) : undefined}
                                disabled={isOrderLoading}
                                placeholder={t('order.placeholders.index')}
                            />
                            <FormInput
                                title={t('order.mobile')}
                                titleSpan={5}
                                wrapperSpan={19}
                                name={"phoneNumber"}
                                error={errors.phoneNumberError ? t(`errors.${errors.phoneNumberError}`) : undefined}
                                disabled={isOrderLoading}
                                placeholder={t('order.placeholders.mobile')}
                            />
                            <FormInput
                                title={t('order.email')}
                                titleSpan={5}
                                wrapperSpan={19}
                                name={"email"}
                                error={errors.emailError ? t(`errors.${errors.emailError}`) : undefined}
                                disabled={isOrderLoading}
                                placeholder={t('order.placeholders.email')}
                            />
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <div style={{ padding: "0 16px" }}>
                            <Typography.Title level={4} style={{ marginBottom: 24, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                {t('order.order_summary')}
                            </Typography.Title>
                            <div style={{ maxHeight: "380px", overflowY: "auto", marginBottom: 24, paddingRight: 8 }}>
                                {perfumes.map((perfume) => (
                                    <OrderItem
                                        key={perfume.id}
                                        perfume={perfume}
                                        quantity={perfumesFromLocalStorage.get(perfume.id)}
                                    />
                                ))}
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <Typography.Title level={5} style={{ marginBottom: 12 }}>{t('order.payment_method')}</Typography.Title>
                                <Form.Item name="paymentMethod">
                                    <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)}>
                                        <Radio value="COD">{t('order.cod')}</Radio>
                                        <Radio value="VNPAY">{t('order.vnpay')}</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </div>
                            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: 24 }}>
                                <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                                    <Typography.Title level={3} style={{ margin: 0 }}>{t('order.to_pay')}</Typography.Title>
                                    <Typography.Title level={3} style={{ margin: 0, color: "var(--color-primary)" }}>
                                        {totalPrice} VND
                                    </Typography.Title>
                                </Row>
                                <Button
                                    htmlType={"submit"}
                                    loading={isOrderLoading}
                                    type="primary"
                                    size="large"
                                    block
                                    icon={<CheckCircleOutlined />}
                                    style={{ height: "48px" }}
                                >
                                    {t('order.validate_order')}
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Form>
        </ContentWrapper>
    );
};

export default Order;
