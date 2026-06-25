import React, { FC, ReactElement } from "react";
import { Form, Select, Typography } from "antd";

type PropsType = {
    title: string;
    name: string;
    error?: string;
    placeholder: string;
    disabled: boolean;
    values: Array<string>;
};

const AddFormSelect: FC<PropsType> = ({ title, name, error, placeholder, disabled, values }): ReactElement => {
    return (
        <div style={{ marginBottom: 16 }}>
            <Typography.Text 
                style={{ 
                    color: "var(--color-text-secondary)", 
                    fontSize: 11, 
                    fontWeight: 700, 
                    letterSpacing: "0.08em", 
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 8
                }}
            >
                {title}
            </Typography.Text>
            <Form.Item name={name} help={error} validateStatus={error ? "error" : ""} style={{ marginBottom: 0 }}>
                <Select placeholder={placeholder} disabled={disabled} style={{ width: "100%" }}>
                    {values.map((option, index) => (
                        <Select.Option key={index} value={option}>
                            {option}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </div>
    );
};

export default AddFormSelect;
