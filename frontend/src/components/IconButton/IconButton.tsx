import React, { FC, ReactElement, ReactNode } from "react";
import { Button } from "antd";

type PropsType = {
    title: string;
    icon: ReactNode;
    disabled?: boolean;
    loading?: boolean;
};

const IconButton: FC<PropsType> = ({ title, icon, disabled, loading }): ReactElement => {
    return (
        <Button type="primary" htmlType="submit" icon={icon} disabled={disabled} loading={loading}>
            {title}
        </Button>
    );
};

export default IconButton;
