package com.perfume.ecommerce.dto.auth;

import com.perfume.ecommerce.dto.user.UserResponse;
import lombok.Data;

@Data
public class AuthenticationResponse {
    private UserResponse user;
    private String token;
}
