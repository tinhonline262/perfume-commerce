import React, { FC, ReactElement, ReactNode } from "react";
import { Form, Input, Typography } from "antd";
import { Rule } from "antd/lib/form";
import PasswordInput from "../PasswordInput/PasswordInput";

import "./FormInput.css";

type PropsType = {
    title: string;
    icon?: ReactNode;
    titleSpan?: number;
    wrapperSpan?: number;
    name: string;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
    rule?: Rule[];
    inputPassword?: boolean;
    formItem?: boolean;
};

const FormInput: FC<PropsType> = ({
    title,
    icon,
    name,
    error,
    placeholder,
    disabled,
    rule,
    inputPassword
}): ReactElement => {
    return (
        <div className={"form-item"}>
            <div className="form-item-label wrap">
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
                {icon}
            </div>
            <div className="form-item-control">
                <Form.Item name={name} help={error} validateStatus={error ? "error" : ""} rules={rule} style={{ marginBottom: 0 }}>
                    {inputPassword ? (
                        <PasswordInput disabled={disabled} placeholder={placeholder} error={!!error} />
                    ) : (
                        <Input disabled={disabled} placeholder={placeholder} />
                    )}
                </Form.Item>
            </div>
        </div>
    );
};

export default FormInput;
