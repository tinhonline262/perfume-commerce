package com.perfume.ecommerce.configuration;

import com.perfume.ecommerce.security.oauth2.CustomOAuth2UserService;
import com.perfume.ecommerce.security.JwtConfigurer;
import com.perfume.ecommerce.security.oauth2.OAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final JwtConfigurer jwtConfigurer;
    private final OAuth2SuccessHandler oauthSuccessHandler;
    private final CustomOAuth2UserService oAuth2UserService;

    @Autowired
    public WebSecurityConfiguration(JwtConfigurer jwtConfigurer, OAuth2SuccessHandler oauthSuccessHandler, @Lazy CustomOAuth2UserService oAuth2UserService) {
        this.jwtConfigurer = jwtConfigurer;
        this.oauthSuccessHandler = oauthSuccessHandler;
        this.oAuth2UserService = oAuth2UserService;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors().and().csrf().disable().authorizeRequests()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/api/v1/auth/**",
                        "/api/v1/auth/login",
                        "/api/v1/registration/**",
                        "/api/v1/perfumes/**",
                        "/api/v1/users/cart",
                        "/api/v1/order/**",
                        "/api/v1/review/**",
                        "/api/v1/payment/**",
                        "/websocket", "/websocket/**",
                        "/img/**",
                        "/static/**").permitAll()
                .antMatchers("/auth/**", "/oauth2/**", "/**/*swagger*/**", "/v2/api-docs").permitAll()
                .anyRequest().authenticated()
                .and()
                .oauth2Login()
                .authorizationEndpoint().baseUri("/oauth2/authorize")
                .and()
                .userInfoEndpoint().userService(oAuth2UserService)
                .and()
                .successHandler(oauthSuccessHandler)
                .and()
                .apply(jwtConfigurer);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
