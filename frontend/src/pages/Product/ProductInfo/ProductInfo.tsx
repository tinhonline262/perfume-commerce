import React, { FC, ReactElement } from "react";
import { Button, Col, Divider, Rate, Row, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";

import Description from "./Description/Description";
import { FullPerfumeResponse } from "../../../types/types";

type PropsType = {
    perfume?: Partial<FullPerfumeResponse>;
    reviewsLength: number;
    addToCart: () => void;
};

const ProductInfo: FC<PropsType> = ({ perfume, reviewsLength, addToCart }): ReactElement => {
    const { t } = useTranslation();
    return (
        <Row gutter={[64, 48]} className="product-info reveal-on-scroll">
            <Col xs={24} md={10} className={"product-image-wrapper"}>
                <div className="product-image-frame">
                    <div className="product-window-bar" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                    </div>
                    <img src={perfume?.filename} alt={perfume?.perfumeTitle || "Fragrance"} className={"product-image"} />
                </div>
            </Col>
            <Col xs={24} md={14}>
                <Row className={"product-header"}>
                    <Col>
                        <Typography.Text className="product-eyebrow">{perfume?.type}</Typography.Text>
                        <Typography.Title level={2}>{perfume?.perfumeTitle}</Typography.Title>
                        <Typography.Title level={4}>{perfume?.perfumer}</Typography.Title>
                    </Col>
                </Row>
                <Row>
                    <Col className={"product-rate"} xs={24}>
                        <Rate allowHalf disabled value={perfume?.perfumeRating} />
                        <Typography.Text>{reviewsLength} {t('product.reviews')}</Typography.Text>
                    </Col>
                </Row>
                <Row>
                    <Typography.Text className="product-stock">{t('product.in_stock', 'In Stock')}</Typography.Text>
                </Row>
                <Row className="product-purchase-row">
                    <Col xs={24} sm={8}>
                        <Space align={"baseline"} className="product-price-wrapper">
                            <Typography.Text className="product-price">${perfume?.price}.00</Typography.Text>
                        </Space>
                    </Col>
                    <Col xs={24} sm={10}>
                        <Button type="primary" className="product-add-button" onClick={addToCart}>
                            {t('product.add_to_cart')}
                        </Button>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col xs={24} sm={8}>
                        <Description title={t('product.gender') + ":"} />
                        <Description title={t('product.volume') + ":"} />
                        <Description title={t('product.year') + ":"} />
                        <Description title={t('product.country') + ":"} />
                        <Description title={t('product.top_notes') + ":"} />
                        <Description title={t('product.middle_notes') + ":"} />
                        <Description title={t('product.base_notes') + ":"} />
                    </Col>
                    <Col xs={24} sm={16}>
                        <Description title={perfume?.perfumeGender} />
                        <Description title={`${perfume?.volume} ml.`} />
                        <Description title={perfume?.year} />
                        <Description title={perfume?.country} />
                        <Description title={perfume?.fragranceTopNotes} />
                        <Description title={perfume?.fragranceMiddleNotes} />
                        <Description title={perfume?.fragranceBaseNotes} />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default ProductInfo;
