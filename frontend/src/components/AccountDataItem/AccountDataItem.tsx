import React, { FC, ReactElement } from "react";
import { Col, Row, Typography } from "antd";

type PropsType = {
    title: string;
    text?: string | string[] | number;
};

const AccountDataItem: FC<PropsType> = ({ title, text }): ReactElement => {
    return (
        <Row className="wrap" style={{ marginBottom: 16, alignItems: "baseline" }}>
            <Col xs={24} sm={8}>
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
            <Col xs={24} sm={16}>
                <Typography.Text style={{ fontWeight: 600, fontSize: 16 }}>
                    {text || "—"}
                </Typography.Text>
            </Col>
        </Row>
    );
};

export default AccountDataItem;
