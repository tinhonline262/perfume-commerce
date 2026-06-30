package com.perfume.ecommerce.enums;

public enum PaymentStatus {
    PENDING,        // Chưa thanh toán
    SUCCESS,        // Đã thanh toán
    FAILED,
    PREPARING,      // Đang chuẩn bị
    PREPARED,       // Đã chuẩn bị xong
    DELIVERING,     // Đang giao
    DELIVERED       // Đã giao
}
