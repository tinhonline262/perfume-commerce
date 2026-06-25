package com.perfume.ecommerce.service.payment;

import com.perfume.ecommerce.domain.Order;
import com.perfume.ecommerce.dto.payment.PaymentVerificationResult;
import com.perfume.ecommerce.enums.PaymentMethod;
import com.perfume.ecommerce.enums.PaymentStatus;
import com.perfume.ecommerce.exception.ApiRequestException;
import com.perfume.ecommerce.repository.OrderRepository;
import com.perfume.ecommerce.service.email.MailSender;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

import static com.perfume.ecommerce.constants.ErrorMessage.ORDER_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentStrategyFactory paymentStrategyFactory;
    private final OrderRepository orderRepository;
    private final MailSender mailSender;

    @Transactional
    public String createPaymentUrl(Long orderId, PaymentMethod paymentMethod, String clientIp) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiRequestException(ORDER_NOT_FOUND, HttpStatus.NOT_FOUND));

        PaymentStrategy strategy = paymentStrategyFactory.getStrategy(paymentMethod);
        return strategy.createPaymentUrl(order, clientIp);
    }

    @Transactional
    public PaymentVerificationResult handleCallback(Map<String, String> requestParams) {
        // Typically vnp_TxnRef is the order ID
        String txnRef = requestParams.get("vnp_TxnRef");
        if (txnRef == null) {
            return new PaymentVerificationResult(false, null, "Missing transaction reference");
        }

        Long orderId = Long.parseLong(txnRef);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiRequestException(ORDER_NOT_FOUND, HttpStatus.NOT_FOUND));

        PaymentStrategy strategy = paymentStrategyFactory.getStrategy(order.getPaymentMethod());
        PaymentVerificationResult result = strategy.verifyPayment(requestParams);

        if (result.isSuccess()) {
            order.setPaymentStatus(PaymentStatus.SUCCESS);
            orderRepository.save(order);
            
            // Send email only on success
            sendOrderEmail(order);
        } else {
            order.setPaymentStatus(PaymentStatus.FAILED);
            orderRepository.save(order);
        }

        return result;
    }
    
    private void sendOrderEmail(Order order) {
        String subject = "Order #" + order.getId();
        String template = "order-template";
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("order", order);
        mailSender.sendMessageHtml(order.getEmail(), subject, template, attributes);
    }
}
