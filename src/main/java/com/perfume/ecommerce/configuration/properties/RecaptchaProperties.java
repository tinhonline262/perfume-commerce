package com.perfume.ecommerce.configuration.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "recaptcha")
public class RecaptchaProperties {

    private String secret = "";
    private String url = "https://www.google.com/recaptcha/api/siteverify?secret=%s&response=%s";

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
