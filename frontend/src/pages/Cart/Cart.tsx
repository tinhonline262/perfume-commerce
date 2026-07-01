import React, { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingBag, ArrowRight, Truck } from "lucide-react";

import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import { selectCartItems, selectIsCartLoading, selectTotalPrice } from "../../redux-toolkit/cart/cart-selector";
import { fetchCart } from "../../redux-toolkit/cart/cart-thunks";
import {
    calculateCartPrice,
    removePerfumeById,
    setCartItemsCount
} from "../../redux-toolkit/cart/cart-slice";
import CartItem from "./CartItem/CartItem";
import Spinner from "../../components/Spinner/Spinner";
import { ORDER, MENU } from "../../constants/routeConstants";
import { formatPrice } from "../../utils/formatPrice";
import "./Cart.css";

const Cart: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const perfumes = useSelector(selectCartItems);
    const isCartLoading = useSelector(selectIsCartLoading);
    const totalPrice = useSelector(selectTotalPrice);
    const [perfumeInCart, setPerfumeInCart] = useState<Map<number, number>>(() => new Map());

    useEffect(() => {
        window.scrollTo(0, 0);
        const perfumesString = localStorage.getItem("perfumes");
        let perfumesFromLocalStorage: Map<number, number> = new Map();
        if (perfumesString) {
            try {
                perfumesFromLocalStorage = new Map(JSON.parse(perfumesString));
            } catch (e) {
                console.error("Failed to parse perfumes from local storage", e);
            }
        }
        dispatch(fetchCart(Array.from(perfumesFromLocalStorage.keys())));
        
        const newMap = new Map();
        perfumesFromLocalStorage.forEach((value: number, key: number) => {
            newMap.set(key, value);
        });
        setPerfumeInCart(newMap);
    }, [dispatch]);

    useEffect(() => {
        dispatch(calculateCartPrice(perfumes));
    }, [perfumes, perfumeInCart, dispatch]);

    const deleteFromCart = (perfumeId: number): void => {
        const newMap = new Map(perfumeInCart);
        newMap.delete(perfumeId);

        if (newMap.size === 0) {
            localStorage.removeItem("perfumes");
        } else {
            localStorage.setItem("perfumes", JSON.stringify(Array.from(newMap.entries())));
        }
        setPerfumeInCart(newMap);
        dispatch(removePerfumeById(perfumeId));
        dispatch(setCartItemsCount(newMap.size));
    };

    const onChangePerfumeItemCount = (perfumeId: number, count: number): void => {
        const newMap = new Map(perfumeInCart);
        newMap.set(perfumeId, count);
        setPerfumeInCart(newMap);
        localStorage.setItem("perfumes", JSON.stringify(Array.from(newMap.entries())));
        dispatch(calculateCartPrice(perfumes)); // Will recalculate using new quantities since component re-renders
    };

    return (
        <ContentWrapper>
            {isCartLoading ? (
                <Spinner />
            ) : (
                <div className="cart-container">
                    {perfumes.length === 0 ? (
                        <div className="cart-empty">
                            <ShoppingBag size={64} className="cart-empty-icon" strokeWidth={1} />
                            <h2>{t('cart.empty_title')}</h2>
                            <p>{t('cart.empty_description')}</p>
                            <Link to={MENU} className="cart-checkout-btn" style={{ maxWidth: '240px' }}>
                                {t('cart.continueShopping')}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="cart-header">
                                <h1 className="cart-title">{t('cart.title')}</h1>
                                <div className="cart-subtitle">
                                    <span>{perfumes.length} {perfumes.length !== 1 ? t('cart.items') : t('cart.item')}</span>
                                    <Link to={MENU} className="cart-continue-link">
                                        {t('cart.continueShopping')} <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="cart-layout">
                                <div className="cart-items-section">
                                    {perfumes.map((perfume) => (
                                        <CartItem
                                            key={perfume.id}
                                            perfume={perfume}
                                            perfumeInCart={perfumeInCart.get(perfume.id) || 1}
                                            onChangePerfumeItemCount={onChangePerfumeItemCount}
                                            deleteFromCart={deleteFromCart}
                                        />
                                    ))}
                                </div>
                                
                                <div className="cart-summary-section">
                                    <div className="cart-summary">
                                        <h2 className="cart-summary-title">{t('cart.summary')}</h2>
                                        
                                        <div className="cart-summary-row">
                                            <span>{t('cart.subtotal')}</span>
                                            <span>{formatPrice(totalPrice)} {t('common.currency', 'VND')}</span>
                                        </div>
                                        
                                        <div className="cart-summary-row">
                                            <span>{t('cart.estimated_shipping')}</span>
                                            <span>{t('cart.free')}</span>
                                        </div>
                                        
                                        <div className="cart-summary-divider"></div>
                                        
                                        <div className="cart-summary-total">
                                            <span>{t('cart.total')}</span>
                                            <span>{formatPrice(totalPrice)} {t('common.currency', 'VND')}</span>
                                        </div>
                                        
                                        <Link to={ORDER} style={{ textDecoration: 'none' }}>
                                            <button className="cart-checkout-btn">
                                                {t('cart.proceed_to_checkout')}
                                            </button>
                                        </Link>
                                        
                                        <div className="cart-free-shipping">
                                            <Truck size={14} /> {t('cart.free_shipping_notice')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </ContentWrapper>
    );
};

export default Cart;