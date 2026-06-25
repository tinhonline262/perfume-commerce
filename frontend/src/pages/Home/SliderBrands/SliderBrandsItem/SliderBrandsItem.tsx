import { Col, Row } from "antd";
import React, { FC, ReactElement } from "react";
import { Link } from "react-router-dom";

import { MENU } from "../../../../constants/routeConstants";
import "./SliderBrandsItem.css";

export type BrandType = {
    name: string;
    url: string;
};

type PropsType = {
    brands: Array<BrandType>;
};

const SliderBrandsItem: FC<PropsType> = ({ brands }): ReactElement => {
    return (
        <Row gutter={[16, 16]} className="slider-brand-row">
            {brands.map((brand: BrandType, index: number) => (
                <Col
                    xs={8}
                    sm={8}
                    md={4}
                    key={index}
                    className={"slider-brand-item"}
                    style={{ "--index": index } as React.CSSProperties}
                >
                    <Link className={"slider-brand-item-link"} to={{ pathname: MENU, state: { id: brand.name } }} />
                    <img className="slider-brand-image" src={brand.url} alt={brand.name} />
                </Col>
            ))}
        </Row>
    );
};

export default SliderBrandsItem;
