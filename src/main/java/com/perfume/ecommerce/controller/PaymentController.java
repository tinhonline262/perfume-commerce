package com.perfume.ecommerce.controller;

import com.perfume.ecommerce.dto.payment.PaymentVerificationResult;
import com.perfume.ecommerce.enums.PaymentMethod;
import com.perfume.ecommerce.service.payment.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/payment")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create/{orderId}")
    public ResponseEntity<Map<String, String>> createPayment(
            @PathVariable Long orderId,
            HttpServletRequest request) {
        
        // For testing locally (otherwise 0:0:0:0:1 isn't handled correctly by VNPay sometimes)
        String clientIp = request.getRemoteAddr();
        if (clientIp.equals("0:0:0:0:0:0:0:1")) {
            clientIp = "127.0.0.1";
        }
        
        String url = paymentService.createPaymentUrl(orderId, PaymentMethod.VNPAY, clientIp);
        Map<String, String> response = new HashMap<>();
        response.put("url", url);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/vnpay-callback")
    public void vnpayCallback(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, String> params = new HashMap<>();
        for (String key : request.getParameterMap().keySet()) {
            params.put(key, request.getParameter(key));
        }

        PaymentVerificationResult result = paymentService.handleCallback(params);

        if (result.isSuccess()) {
            // Append the order ID so the frontend can retrieve it on success
            Long orderId = result.getOrderId();
            if (orderId != null) {
                response.sendRedirect("http://localhost:3000/order/finalize?orderId=" + orderId);
            } else {
                response.sendRedirect("http://localhost:3000/order/finalize");
            }
        } else {
            response.sendRedirect("http://localhost:3000/order/failed");
        }
    }
}
