import React, { FC, ReactElement } from "react";
import { Button, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";

import { MENU } from "../../../constants/routeConstants";

type PropsType = {
    errorMessage: string;
};

const ErrorMessage: FC<PropsType> = ({ errorMessage }): ReactElement => {
    return (
        <Row className="wrap">
            <Col xs={24} sm={24} style={{ textAlign: "center", padding: "80px 24px" }}>
                <Typography.Title level={3} style={{ marginBottom: "24px" }}>{errorMessage}</Typography.Title>
                <Link to={{ pathname: MENU, state: { id: "all" } }}>
                    <Button type="primary">Return to catalog</Button>
                </Link>
            </Col>
        </Row>
    );
};

export default ErrorMessage;
