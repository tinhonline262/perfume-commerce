import React, {FC, ReactElement, ReactNode} from "react";
import { Space, Typography } from "antd";

import "./ContentTitle.css";

type PropsType = {
    icon?: ReactNode;
    title: string;
    titleLevel?: 1 | 2 | 3 | 4 | 5;
};

const ContentTitle: FC<PropsType> = ({ icon, title, titleLevel }): ReactElement => {
    return (
        <Space align="center" className={"title-icon wrap"} size={6}>
            <div className={"title"}>
                {icon}
                <Typography.Title level={titleLevel} style={{ margin: 0 }}>{title}</Typography.Title>
            </div>
        </Space>
    );
};

export default ContentTitle;
