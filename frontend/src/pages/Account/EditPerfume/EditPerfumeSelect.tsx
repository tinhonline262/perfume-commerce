import React, { FC, ReactElement } from "react";
import { Form, Select, Typography, Row, Col } from "antd";

type PropsType = {
    title: string;
    name: string;
    error?: string;
    placeholder: string;
    disabled: boolean;
    values: Array<string>;
};

const EditPerfumeSelect: FC<PropsType> = ({ title, name, error, placeholder, disabled, values }): ReactElement => {
    return (
        <Row className={"form-item"}>
            <Col xs={24} sm={6} className="form-item-label">
                <Typography.Text 
                    style={{ 
                        color: "var(--color-text-secondary)", 
                        fontSize: 11, 
                        fontWeight: 700, 
                        letterSpacing: "0.08em", 
                        textTransform: "uppercase" 
                    }}
                >
                    {title}
                </Typography.Text>
            </Col>
            <Col xs={24} sm={18}>
                <Form.Item name={name} help={error} validateStatus={error ? "error" : ""} style={{ marginBottom: 0 }}>
                    <Select placeholder={placeholder} disabled={disabled} style={{ width: "100%" }}>
                        {values.map((option, index) => (
                            <Select.Option key={index} value={option}>
                                {option}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
        </Row>
    );
};

export default EditPerfumeSelect;
