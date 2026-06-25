import React, { FC, ReactElement } from "react";
import {Col, Divider, Rate, Row, Typography} from "antd";

import { ReviewResponse } from "../../../../types/types";

type PropType = {
    review: ReviewResponse;
};

const ReviewItem: FC<PropType> = ({ review }): ReactElement => {
    return (
        <Row gutter={[32, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={6} md={5}>
                <div className="truncate">
                    <Typography.Text strong>{review.author}</Typography.Text>
                </div>
                <div style={{ marginTop: 4, marginBottom: 8 }}>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>{review.date}</Typography.Text>
                </div>
                <div>
                    <Rate disabled value={review.rating} style={{ fontSize: 14 }} />
                </div>
            </Col>
            <Col xs={24} sm={18} md={14} className="wrap">
                <Typography.Text style={{ lineHeight: 1.6, fontSize: 16 }}>{review.message}</Typography.Text>
            </Col>
            <Divider style={{ margin: "24px 0 0" }} />
        </Row>
    );
};

export default ReviewItem;
