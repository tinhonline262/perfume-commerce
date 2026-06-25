import React, { FC, ReactElement } from "react";
import { Carousel, Typography } from "antd";
import { useTranslation } from "react-i18next";

import { brandsItem } from "./SliderBrandsData";
import SliderBrandsItem from "./SliderBrandsItem/SliderBrandsItem";
import "./SliderBrands.css";

const SliderBrands: FC = (): ReactElement => {
    const { t } = useTranslation();
    return (
        <section className={"brands-wrapper reveal-on-scroll"}>
            <div className="brands-wrapper-heading">
                <span>{t('home.featured_maisons', 'Featured maisons')}</span>
                <Typography.Title level={2} className={"brands-wrapper-title"}>
                    {t('home.brands')}
                </Typography.Title>
            </div>
            <Carousel className={"brands-carousel"}>
                <SliderBrandsItem brands={brandsItem.slice(0, 6)} />
                <SliderBrandsItem brands={brandsItem.slice(6, 12)} />
                <SliderBrandsItem brands={brandsItem.slice(12, 18)} />
            </Carousel>
        </section>
    );
};

export default SliderBrands;
