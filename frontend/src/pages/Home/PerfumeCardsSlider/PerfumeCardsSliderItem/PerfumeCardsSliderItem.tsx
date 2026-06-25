import React, { FC, ReactElement } from "react";
import { Row } from "antd";

import PerfumeCard from "../../../../components/PerfumeCard/PerfumeCard";
import { PerfumeResponse } from "../../../../types/types";

type PropsType = {
    perfumes: Array<PerfumeResponse>;
};

const PerfumeCardsSliderItem: FC<PropsType> = ({ perfumes }): ReactElement => {
    return (
        <Row gutter={[24, 24]} className="perfume-cards-slider-row">
            {perfumes.slice(0, 4).map((perfume) => (
                <PerfumeCard key={perfume.id} perfume={perfume} colSpan={6} />
            ))}
        </Row>
    );
};

export default PerfumeCardsSliderItem;
