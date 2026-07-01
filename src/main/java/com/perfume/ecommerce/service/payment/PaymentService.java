package com.perfume.ecommerce.service.payment;

import com.perfume.ecommerce.domain.Order;
import com.perfume.ecommerce.dto.payment.PaymentVerificationResult;
import com.perfume.ecommerce.enums.PaymentMethod;
import com.perfume.ecommerce.enums.PaymentStatus;
import com.perfume.ecommerce.exception.ApiRequestException;
import com.perfume.ecommerce.repository.OrderRepository;
import com.perfume.ecommerce.service.email.MailSender;
import com.perfume.ecommerce.service.impl.OrderServiceImpl;
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
    private final OrderServiceImpl orderService;

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
            return new PaymentVerificationResult(false, null, "Missing transaction reference", null);
        }

        Long orderId = Long.parseLong(txnRef);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiRequestException(ORDER_NOT_FOUND, HttpStatus.NOT_FOUND));

        PaymentStrategy strategy = paymentStrategyFactory.getStrategy(order.getPaymentMethod());
        PaymentVerificationResult result = strategy.verifyPayment(requestParams);
        
        // Attach the orderId to the result so the controller can use it
        result.setOrderId(orderId);

        if (result.isSuccess()) {
            if (order.getPaymentStatus() != PaymentStatus.PAID) {
                order.setPaymentStatus(PaymentStatus.PAID);
                orderRepository.save(order);
                orderService.reserveInventory(order.getOrderItems(), null);
                
                // Send email only on success
                sendOrderEmail(order);
            }
        } else {
            // Failed payment -> still UNPAID
            order.setPaymentStatus(PaymentStatus.UNPAID);
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
