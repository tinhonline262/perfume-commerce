import { useTranslation } from "react-i18next";
import { Tag } from "antd";
import React from "react";

export const getOrderStatusLabel = (status: string, t: any) => {
    switch (status) {
        case "PENDING":
            return t("tracking.status.pending", "Chờ xác nhận");
        case "PREPARING":
            return t("tracking.status.preparing", "Đang chuẩn bị");
        case "READY_TO_SHIP":
            return t("tracking.status.readyToShip", "Chuẩn bị giao");
        case "SHIPPING":
            return t("tracking.status.shipping", "Đang giao");
        case "DELIVERED":
            return t("tracking.status.delivered", "Đã giao");
        case "CANCELLED":
            return t("tracking.status.cancelled", "Đã hủy");
        default:
            return status;
    }
};

export const getPaymentStatusLabel = (status: string, t: any) => {
    switch (status) {
        case "UNPAID":
            return t("payment.status.unpaid", "Chưa thanh toán");
        case "PAID":
            return t("payment.status.paid", "Đã thanh toán");
        case "FAILED":
            return t("payment.status.failed", "Thanh toán thất bại");
        case "REFUNDED":
            return t("payment.status.refunded", "Đã hoàn tiền");
        case "PENDING":
            return t("payment.status.pending", "Chờ thanh toán");
        default:
            return status;
    }
};

export const getOrderStatusColor = (status: string) => {
    switch (status) {
        case "PENDING":
            return "orange";
        case "PREPARING":
            return "blue";
        case "READY_TO_SHIP":
            return "cyan";
        case "SHIPPING":
            return "purple";
        case "DELIVERED":
            return "green";
        case "CANCELLED":
            return "red";
        default:
            return "default";
    }
};

export const getPaymentStatusColor = (status: string) => {
    switch (status) {
        case "UNPAID":
            return "orange";
        case "PAID":
            return "green";
        case "FAILED":
            return "red";
        case "REFUNDED":
            return "default"; // Gray
        default:
            return "default";
    }
};

interface BadgeProps {
    status: string;
}

const badgeStyle: React.CSSProperties = {
    whiteSpace: "nowrap",
    padding: "0 8px",
    minWidth: "100px",
    textAlign: "center",
};

export const OrderStatusBadge: React.FC<BadgeProps> = ({ status }) => {
    const { t } = useTranslation();
    return (
        <Tag color={getOrderStatusColor(status)} style={badgeStyle}>
            {getOrderStatusLabel(status, t)}
        </Tag>
    );
};

export const PaymentStatusBadge: React.FC<BadgeProps> = ({ status }) => {
    const { t } = useTranslation();
    return (
        <Tag color={getPaymentStatusColor(status)} style={badgeStyle}>
            {getPaymentStatusLabel(status, t)}
        </Tag>
    );
};
