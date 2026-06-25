import React, { FC, ReactElement } from "react";
import { Radio, RadioChangeEvent, Row, Typography } from "antd";

import { PerfumePrice } from "../../../types/types";

type PropsType = {
    title: string;
    onChange: (event: RadioChangeEvent) => void;
    data: Array<PerfumePrice>;
};

const MenuRadioSection: FC<PropsType> = ({ title, onChange, data }): ReactElement => {
    return (
        <div className="menu-sidebar-section">
            <Typography.Title level={5}>
                {title}
            </Typography.Title>
            <Radio.Group onChange={onChange}>
                {data.map((value, index) => (
                    <Radio key={index} value={value.array}>{value.name}</Radio>
                ))}
            </Radio.Group>
        </div>
    );
};

export default MenuRadioSection;
