import React, { FC, ReactElement } from "react";
import { Button, Card, Col, Form, FormInstance, Input, Rate, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

import { ReviewResponse, ReviewError } from "../../../types/types";
import ReviewItem from "./ReviewItem/ReviewItem";
import { ReviewData } from "../Product";
import "./ProductReviews.css";

type PropType = {
    reviews: ReviewResponse[];
    reviewErrors: Partial<ReviewError>;
    addReview: (data: ReviewData) => void;
    form?: FormInstance<any>;
};

const ProductReviews: FC<PropType> = ({ reviews, reviewErrors, addReview, form }): ReactElement => {
    const { t } = useTranslation();
    const { authorError, messageError, ratingError } = reviewErrors;

    return (
        <>
            <Row>
                <Col xs={24} sm={24} className={"product-reviews-title"}>
                    <Typography.Title level={3}>{t('product.reviews', 'Reviews')}</Typography.Title>
                </Col>
            </Row>
            <Row>
                {reviews.length === 0 ? (
                    <Col xs={24} sm={24} className={"product-reviews-title"}>
                        <Typography.Text>{t('product.no_reviews', 'Be the first to share your experience with this fragrance.')}</Typography.Text>
                    </Col>
                ) : (
                    <Col xs={24} sm={24}>
                        {reviews.map((review) => (
                            <ReviewItem key={review.id} review={review} />
                        ))}
                    </Col>
                )}
            </Row>
            <Row>
                <Col xs={24} sm={24}>
                    <Form onFinish={addReview} form={form}>
                        <Card className="product-review-form-card">
                            <Row gutter={32}>
                                <Col xs={24} sm={6}>
                                    <Typography.Text>{t('product.author', 'Your name')}</Typography.Text>
                                    <Typography.Text type="danger"> *</Typography.Text>
                                    <Form.Item
                                        name={"author"}
                                        help={authorError ? t(`errors.${authorError}`, authorError) : undefined}
                                        validateStatus={authorError && "error"}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Typography.Text>{t('product.your_mark', 'Your mark')}</Typography.Text>
                                    <Typography.Text type="danger"> *</Typography.Text>
                                    <div>
                                        <Form.Item
                                            name={"rating"}
                                            help={ratingError ? t(`errors.${ratingError}`, ratingError) : undefined}
                                            validateStatus={ratingError && "error"}
                                        >
                                            <Rate />
                                        </Form.Item>
                                    </div>
                                </Col>
                            </Row>
                            <Row className={"product-reviews-wrapper"}>
                                <Col xs={24} sm={24}>
                                    <Typography.Text>{t('product.message', 'Message text')}</Typography.Text>
                                    <Typography.Text type="danger"> *</Typography.Text>
                                    <Form.Item
                                        name={"message"}
                                        help={messageError ? t(`errors.${messageError}`, messageError) : undefined}
                                        validateStatus={messageError && "error"}
                                    >
                                        <Input.TextArea rows={4} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className={"product-reviews-wrapper"}>
                                <Col xs={24} sm={24}>
                                    <Button type={"primary"} htmlType={"submit"}>
                                        {t('product.post_review', 'Post a review')}
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default ProductReviews;
