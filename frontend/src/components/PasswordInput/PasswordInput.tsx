import React, { FC, ReactElement, useState, forwardRef } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import "./PasswordInput.css";

type PropsType = {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    name?: string;
};

const PasswordInput = forwardRef<HTMLInputElement, PropsType>(({
    value,
    onChange,
    placeholder,
    error,
    disabled,
    name
}, ref): ReactElement => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="password-input-wrapper">
            <input
                ref={ref}
                type={visible ? "text" : "password"}
                name={name}
                value={value || ""}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`password-input-field ${error ? "has-error" : ""}`}
                autoComplete="off"
            />
            <button
                type="button"
                className="password-toggle-icon"
                onClick={() => setVisible(!visible)}
                tabIndex={-1} // Prevent tabbing to the eye icon
                disabled={disabled}
            >
                {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </button>
        </div>
    );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
