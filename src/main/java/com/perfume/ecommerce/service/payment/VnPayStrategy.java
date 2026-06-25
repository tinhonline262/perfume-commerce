package com.perfume.ecommerce.service.payment;

import com.perfume.ecommerce.configuration.properties.VnPayProperties;
import com.perfume.ecommerce.domain.Order;
import com.perfume.ecommerce.dto.payment.PaymentVerificationResult;
import com.perfume.ecommerce.enums.PaymentMethod;
import com.perfume.ecommerce.util.VnPaySecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VnPayStrategy implements PaymentStrategy {

    private final VnPayProperties vnPayProperties;

    @Override
    public String createPaymentUrl(Order order, String clientIp) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = String.valueOf(order.getId());
        String vnp_IpAddr = clientIp;
        String vnp_TmnCode = vnPayProperties.getTmnCode();

        // Convert USD to VND (Assume 1 USD = 25000 VND for simplicity, or inject an exchange rate service)
        double exchangeRate = 25000.0;
        double amountInVnd = order.getTotalPrice() * exchangeRate;
        // VNPay requires the amount in VND multiplied by 100
        long amount = (long) (amountInVnd * 100);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Payment for order " + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "en");

        vnp_Params.put("vnp_ReturnUrl", vnPayProperties.getReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        try {
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error encoding VNPay parameters", e);
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VnPaySecurityUtil.hmacSHA512(vnPayProperties.getHashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        return vnPayProperties.getUrl() + "?" + queryUrl;
    }

    @Override
    public PaymentVerificationResult verifyPayment(Map<String, String> requestParams) {
        String vnp_SecureHash = requestParams.get("vnp_SecureHash");
        
        Map<String, String> fields = new HashMap<>();
        for (Map.Entry<String, String> entry : requestParams.entrySet()) {
            String fieldName = entry.getKey();
            String fieldValue = entry.getValue();
            if ((fieldValue != null) && (fieldValue.length() > 0) && !fieldName.equals("vnp_SecureHashType") && !fieldName.equals("vnp_SecureHash")) {
                fields.put(fieldName, fieldValue);
            }
        }

        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        
        try {
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = fields.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        hashData.append('&');
                    }
                }
            }
        } catch (Exception e) {
            return new PaymentVerificationResult(false, null, "Error decoding params");
        }

        String signValue = VnPaySecurityUtil.hmacSHA512(vnPayProperties.getHashSecret(), hashData.toString());
        
        if (signValue.equals(vnp_SecureHash)) {
            String responseCode = requestParams.get("vnp_ResponseCode");
            String transactionNo = requestParams.get("vnp_TransactionNo");
            if ("00".equals(responseCode)) {
                return new PaymentVerificationResult(true, transactionNo, "Success");
            } else {
                return new PaymentVerificationResult(false, transactionNo, "Payment failed with response code: " + responseCode);
            }
        } else {
            return new PaymentVerificationResult(false, null, "Invalid signature");
        }
    }

    @Override
    public PaymentMethod getSupportedMethod() {
        return PaymentMethod.VNPAY;
    }
}
