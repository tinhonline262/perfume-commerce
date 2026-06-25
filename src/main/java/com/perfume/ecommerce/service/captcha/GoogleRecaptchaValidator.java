package com.perfume.ecommerce.service.captcha;

import com.perfume.ecommerce.configuration.properties.RecaptchaProperties;
import com.perfume.ecommerce.dto.CaptchaResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class GoogleRecaptchaValidator implements CaptchaValidator {

    private final RestTemplate restTemplate;
    private final RecaptchaProperties recaptchaProperties;

    @Override
    public void validate(String captcha) {
        String url = String.format(recaptchaProperties.getUrl(), recaptchaProperties.getSecret(), captcha);
        restTemplate.postForObject(url, Collections.emptyList(), CaptchaResponse.class);
    }
}
