import React, { FC, ReactElement } from "react";
import { Card, Typography } from "antd";

import { PerfumeResponse } from "../../../types/types";
import "./OrderItem.css";

type PropsType = {
    perfume: PerfumeResponse;
    quantity?: number;
};

const OrderItem: FC<PropsType> = ({ perfume, quantity }): ReactElement => {
    return (
        <Card className="order-item" bordered={false}>
            <div className="order-item-details">
                <div className="order-item-image">
                    <img src={perfume.filename} alt={perfume.perfumeTitle} />
                </div>
                <div className="order-item-info wrap">
                    <Typography.Title level={5} style={{ margin: 0, fontWeight: 700 }}>
                        {perfume.perfumer}
                    </Typography.Title>
                    <Typography.Text className="truncate" style={{ display: "block", fontSize: 14 }}>
                        {perfume.perfumeTitle}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {perfume.volume} ml.
                    </Typography.Text>
                </div>
                <div className="order-item-actions">
                    <Typography.Title level={5} className="order-item-price" style={{ margin: 0, fontWeight: 700 }}>
                        {perfume.price * (quantity ?? 1)} VND
                    </Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        Qty: {quantity}
                    </Typography.Text>
                </div>
            </div>
        </Card>
    );
};

export default OrderItem;
