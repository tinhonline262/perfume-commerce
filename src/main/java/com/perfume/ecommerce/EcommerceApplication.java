package com.perfume.ecommerce;

import com.perfume.ecommerce.configuration.properties.FrontendProperties;
import com.perfume.ecommerce.configuration.properties.JwtProperties;
import com.perfume.ecommerce.configuration.properties.RecaptchaProperties;
import com.perfume.ecommerce.configuration.properties.S3StorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({
        FrontendProperties.class,
        JwtProperties.class,
        RecaptchaProperties.class,
        S3StorageProperties.class
})
public class EcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcommerceApplication.class, args);
    }

}
