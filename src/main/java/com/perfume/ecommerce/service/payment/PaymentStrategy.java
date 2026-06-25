package com.perfume.ecommerce.service.payment;

import com.perfume.ecommerce.domain.Order;
import com.perfume.ecommerce.dto.payment.PaymentVerificationResult;
import com.perfume.ecommerce.enums.PaymentMethod;

import java.util.Map;

public interface PaymentStrategy {
    String createPaymentUrl(Order order, String clientIp);
    PaymentVerificationResult verifyPayment(Map<String, String> requestParams);
    PaymentMethod getSupportedMethod();
}
