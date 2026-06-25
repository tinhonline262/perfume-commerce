import React, { FC, ReactElement } from "react";
import { Button, Card, Col, Typography } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { PerfumeResponse } from "../../types/types";
import { ACCOUNT_ADMIN_PERFUMES, PRODUCT } from "../../constants/routeConstants";
import { useCart } from "../../hooks/useCart";
import "./PerfumeCard.css";

type PropsType = {
    perfume: PerfumeResponse;
    colSpan: number;
    edit?: boolean;
    onOpenDelete?: (perfume: PerfumeResponse) => void;
    fullWidth?: boolean;
};

const PerfumeCard: FC<PropsType> = ({ perfume, colSpan, edit, onOpenDelete, fullWidth }): ReactElement => {
    const { t } = useTranslation();
    const { addToCart } = useCart(perfume.id);

    const onClickAddToCart = (event: any) => {
        event.preventDefault();
        addToCart();
    };

    return (
        <Col xs={24} sm={fullWidth ? 24 : 12} lg={colSpan}>
            <Link to={`${PRODUCT}/${perfume.id}`}>
                <Card
                    className={`perfume-card ${fullWidth ? 'perfume-card-full' : ''}`}
                    cover={
                        <div className="perfume-card-image-shell">
                            <img className={"perfume-card-image"} alt={perfume.perfumeTitle} src={perfume.filename} />
                        </div>
                    }
                    hoverable
                    actions={
                        edit
                            ? [
                                  <Link to={`${ACCOUNT_ADMIN_PERFUMES}/${perfume.id}`}>
                                      <Button>{t('account.edit')}</Button>
                                  </Link>,
                                  <Button onClick={(e) => { e.preventDefault(); onOpenDelete!(perfume); }} danger>
                                      {t('account.admin.delete')}
                                  </Button>
                              ]
                            : [
                                  <Button type="primary" onClick={onClickAddToCart}>
                                      {t('product.add_to_cart')}
                                  </Button>
                              ]
                    }
                >
                    <div className="perfume-card-meta-row">
                        <span>{perfume.volume} ml</span>
                        <span>{perfume.reviewsCount} {t('product.reviews', 'reviews').toLowerCase()}</span>
                    </div>
                    <Typography.Title level={4} className="perfume-card-title">
                        {perfume.perfumer}
                    </Typography.Title>
                    <Typography.Text className="perfume-card-description">{perfume.perfumeTitle}</Typography.Text>
                    <Typography.Text className={"perfume-card-price"}>${perfume.price}.00</Typography.Text>
                </Card>
            </Link>
        </Col>
    );
};

export default PerfumeCard;
