package com.perfume.ecommerce.configuration.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "payment.vnpay")
public class VnPayProperties {
    private String url;
    private String returnUrl;
    private String tmnCode;
    private String hashSecret;
    private String apiUrl;
}
