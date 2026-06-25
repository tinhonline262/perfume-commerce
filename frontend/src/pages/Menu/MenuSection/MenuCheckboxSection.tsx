import React, { FC, ReactElement } from "react";
import { Checkbox, Row, Typography } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";

import { CheckboxCategoryFilter } from "../Menu";

type PropsType = {
    title: string;
    onChange: (checkedValues: CheckboxValueType[], category: CheckboxCategoryFilter) => void;
    category: CheckboxCategoryFilter;
    data: Array<{ name: string }>;
    selectedValues: Array<string>;
};

const MenuCheckboxSection: FC<PropsType> = ({ title, onChange, category, data, selectedValues }): ReactElement => {
    return (
        <div className="menu-sidebar-section">
            <Typography.Title level={5}>
                {title}
            </Typography.Title>
            <Checkbox.Group
                value={selectedValues}
                onChange={(checkedValues) => onChange(checkedValues, category)}
                style={{
                    overflow: "auto",
                    maxHeight: "320px",
                    width: "100%"
                }}
            >
                {data.map((value, index) => (
                    <Checkbox key={index} value={value.name}>{value.name}</Checkbox>
                ))}
            </Checkbox.Group>
        </div>
    );
};

export default MenuCheckboxSection;
