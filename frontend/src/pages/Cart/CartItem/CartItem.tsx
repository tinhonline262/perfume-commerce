import React, { FC, memo, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Minus, Trash2 } from "lucide-react";

import { PerfumeResponse } from "../../../types/types";
import { formatPrice } from "../../../utils/formatPrice";

type PropsType = {
    perfume: PerfumeResponse;
    perfumeInCart: number;
    onChangePerfumeItemCount: (perfumeId: number, inputValue: number) => void;
    deleteFromCart: (perfumeId: number) => void;
};

const CartItem: FC<PropsType> = memo(({
    perfume,
    perfumeInCart,
    onChangePerfumeItemCount,
    deleteFromCart
}): ReactElement => {
    const { t } = useTranslation();
    
    const handleIncrement = () => {
        if (perfumeInCart < 99) {
            onChangePerfumeItemCount(perfume.id, perfumeInCart + 1);
        }
    };

    const handleDecrement = () => {
        if (perfumeInCart > 1) {
            onChangePerfumeItemCount(perfume.id, perfumeInCart - 1);
        }
    };

    return (
        <div className="cart-item">
            <div className="cart-item-image">
                <img src={perfume.filename} alt={perfume.perfumeTitle} />
            </div>
            
            <div className="cart-item-content">
                <div className="cart-item-header">
                    <div>
                        <div className="cart-item-brand">{perfume.perfumer}</div>
                        <h3 className="cart-item-title">{perfume.perfumeTitle}</h3>
                    </div>
                    <div className="cart-item-price">{formatPrice(perfume.price * perfumeInCart)} {t('common.currency', 'VND')}</div>
                </div>
                
                <div className="cart-item-volume">{perfume.volume} ml.</div>
                
                <div className="cart-item-actions">
                    <div className="cart-qty-control">
                        <button 
                            className="cart-qty-btn" 
                            onClick={handleDecrement}
                            disabled={perfumeInCart <= 1}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="cart-qty-value">{perfumeInCart}</span>
                        <button 
                            className="cart-qty-btn" 
                            onClick={handleIncrement}
                            disabled={perfumeInCart >= 99}
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                    
                    <button 
                        className="cart-remove-btn"
                        onClick={() => deleteFromCart(perfume.id)}
                    >
                        <Trash2 size={16} /> {t('cart.remove')}
                    </button>
                </div>
            </div>
        </div>
    );
});

export default CartItem;