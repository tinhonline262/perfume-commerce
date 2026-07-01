import React, { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCartOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ContentTitle from "../../components/ContentTitle/ContentTitle";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import { selectCartItems, selectIsCartLoading } from "../../redux-toolkit/cart/cart-selector";
import { fetchCart } from "../../redux-toolkit/cart/cart-thunks";
import {
    calculateCartPrice,
    removePerfumeById,
    resetCartState,
    setCartItemsCount
} from "../../redux-toolkit/cart/cart-slice";
import CartItem from "./CartItem/CartItem";
import Spinner from "../../components/Spinner/Spinner";
import CartTotalPrice from "./CartTotalPrice";
import { ORDER } from "../../constants/routeConstants";
import "./Cart.css";

const Cart: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const perfumes = useSelector(selectCartItems);
    const isCartLoading = useSelector(selectIsCartLoading);
    const [perfumeInCart, setPerfumeInCart] = useState(() => new Map());

    useEffect(() => {
        window.scrollTo(0, 0);
        const perfumesFromLocalStorage: Map<number, number> = new Map(
            JSON.parse(localStorage.getItem("perfumes") as string)
        );

        dispatch(fetchCart(Array.from(perfumesFromLocalStorage.keys())));
        perfumesFromLocalStorage.forEach((value: number, key: number) => {
            setPerfumeInCart(perfumeInCart.set(key, value));
        });

        return () => {
            dispatch(resetCartState());
        };
    }, []);

    const deleteFromCart = (perfumeId: number): void => {
        perfumeInCart.delete(perfumeId);

        if (perfumeInCart.size === 0) {
            localStorage.removeItem("perfumes");
            setPerfumeInCart(new Map());
        } else {
            localStorage.setItem("perfumes", JSON.stringify(Array.from(perfumeInCart.entries())));
        }
        dispatch(removePerfumeById(perfumeId));
        dispatch(setCartItemsCount(perfumeInCart.size));
    };

    const onChangePerfumeItemCount = (perfumeId: number, inputValue: number): void => {
        setPerfumes(perfumeId, inputValue);
        dispatch(calculateCartPrice(perfumes));
    };

    const setPerfumes = (perfumeId: number, perfumeCount: number): void => {
        setPerfumeInCart(perfumeInCart.set(perfumeId, perfumeCount));
        localStorage.setItem("perfumes", JSON.stringify(Array.from(perfumeInCart.entries())));
    };

    return (
        <ContentWrapper>
            {isCartLoading ? (
                <Spinner />
            ) : (
                <>
                    <div style={{ textAlign: "center" }}>
                        <ContentTitle icon={<ShoppingCartOutlined />} title={t('cart.title')} />
                    </div>
                    <Row gutter={32}>
                        {perfumes.length === 0 ? (
                            <Col xs={24} sm={24}>
                                <div className="cart-empty-container">
                                    <ShoppingOutlined className="cart-empty-icon" />
                                    <Typography.Title level={3} className="cart-empty-title">
                                        {t('cart.empty_title')}
                                    </Typography.Title>
                                    <Typography.Text className="cart-empty-description">
                                        {t('cart.empty_description')}
                                    </Typography.Text>
                                    <div className="cart-empty-actions">
                                        <Link to="/menu">
                                            <Button type="primary" size="large" className="cart-empty-button">
                                                {t('cart.continueShopping')}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        ) : (
                            <>
                                <Col xs={24} sm={16}>
                                    {perfumes.map((perfume) => (
                                        <CartItem
                                            key={perfume.id}
                                            perfume={perfume}
                                            perfumeInCart={perfumeInCart.get(perfume.id)}
                                            onChangePerfumeItemCount={onChangePerfumeItemCount}
                                            deleteFromCart={deleteFromCart}
                                        />
                                    ))}
                                </Col>
                                <Col xs={24} sm={8}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                        <CartTotalPrice />
                                        <Link to={ORDER} style={{ width: "100%" }}>
                                            <Button type="primary" icon={<ShoppingOutlined />} size="large" style={{ width: "100%" }}>
                                                {t('cart.checkout')}
                                            </Button>
                                        </Link>
                                    </div>
                                </Col>
                            </>
                        )}
                    </Row>
                </>
            )}
        </ContentWrapper>
    );
};

export default Cart;
