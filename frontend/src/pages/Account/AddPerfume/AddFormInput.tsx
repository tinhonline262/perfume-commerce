import React, { FC, ReactElement } from "react";
import { Form, Input, Typography } from "antd";

type PropsType = {
    title: string;
    name: string;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
};

const AddFormInput: FC<PropsType> = ({ title, name, error, placeholder, disabled }): ReactElement => {
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
            <Form.Item name={name} help={error} validateStatus={error && "error"} style={{ marginBottom: 0 }}>
                <Input disabled={disabled} placeholder={placeholder} />
            </Form.Item>
        </div>
    );
};

export default AddFormInput;
