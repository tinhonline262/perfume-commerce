import React, { FC, memo, ReactElement } from "react";
import { Typography } from "antd";

import { PerfumeResponse } from "../../../types/types";

type PropsType = {
    perfume: PerfumeResponse;
};

const CartItemInfo: FC<PropsType> = memo(({ perfume }): ReactElement => {
    return (
        <>
            <div className="cart-item-image">
                <img src={perfume.filename} alt={perfume.perfumeTitle} />
            </div>
            <div className="cart-item-info wrap">
                <Typography.Title level={4} style={{ marginBottom: 4 }}>{perfume.perfumer}</Typography.Title>
                <Typography.Text className="truncate" style={{ display: "block", marginBottom: 8, fontSize: 16 }}>{perfume.perfumeTitle}</Typography.Text>
                <Typography.Text type="secondary" strong>{perfume.volume} ml.</Typography.Text>
            </div>
        </>
    );
});

export default CartItemInfo;
