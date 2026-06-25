import React, { FC, ReactElement, ReactNode } from "react";
import { Layout } from "antd";

import "./ContentWrapper.css";

type PropsType = {
    children: ReactNode;
    narrow?: boolean;
};

const ContentWrapper: FC<PropsType> = ({ children, narrow }): ReactElement => {
    return (
        <Layout>
            <Layout.Content className={`content-wrapper ${narrow ? "content-wrapper--narrow" : ""}`}>
                {children}
            </Layout.Content>
        </Layout>
    );
};

export default ContentWrapper;
