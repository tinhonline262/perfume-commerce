package com.perfume.ecommerce.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentVerificationResult {
    private boolean isSuccess;
    private String transactionId;
    private String message;
    private Long orderId; // Added to easily retrieve order ID after callback

    // Constructor for backward compatibility in case some places only pass 3 arguments
    public PaymentVerificationResult(boolean isSuccess, String transactionId, String message) {
        this.isSuccess = isSuccess;
        this.transactionId = transactionId;
        this.message = message;
    }
}
