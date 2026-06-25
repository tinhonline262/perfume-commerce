import React, { FC, ReactElement, useEffect, useState } from "react";
import { Card, InputNumber, Typography } from "antd";

import { PerfumeResponse } from "../../../types/types";
import RemoveButton from "./RemoveButton";
import CartItemInfo from "./CartItemInfo";

type PropsType = {
    perfume: PerfumeResponse;
    perfumeInCart: number;
    onChangePerfumeItemCount: (perfumeId: number, inputValue: number) => void;
    deleteFromCart: (perfumeId: number) => void;
};

const CartItem: FC<PropsType> = ({
    perfume,
    perfumeInCart,
    onChangePerfumeItemCount,
    deleteFromCart
}): ReactElement => {
    const [perfumeCount, setPerfumeCount] = useState(1);

    useEffect(() => {
        setPerfumeCount(perfumeInCart);
    }, []);

    const handlePerfumesCount = (value: number | null): void => {
        setPerfumeCount(value!);
        onChangePerfumeItemCount(perfume.id, value!);
    };

    return (
        <Card className="cart-item" bordered={false}>
            <div className="cart-item-details">
                <CartItemInfo perfume={perfume} />
                <div className="cart-item-actions">
                    <Typography.Title level={4} className="cart-item-price">
                        ${perfume.price * perfumeCount}.00
                    </Typography.Title>
                    <div className="cart-item-controls">
                        <InputNumber
                            min={1}
                            max={99}
                            value={perfumeCount}
                            onChange={handlePerfumesCount}
                        />
                        <RemoveButton perfumeId={perfume.id} deleteFromCart={deleteFromCart} />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default CartItem;
