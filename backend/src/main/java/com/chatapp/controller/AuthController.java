package com.chatapp.controller;

import com.chatapp.dto.AuthDtos.AuthResponse;
import com.chatapp.dto.AuthDtos.ChangePasswordRequest;
import com.chatapp.dto.AuthDtos.ForgotPasswordRequest;
import com.chatapp.dto.AuthDtos.LoginRequest;
import com.chatapp.dto.AuthDtos.RegisterRequest;
import com.chatapp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService auth;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return auth.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return auth.login(request);
    }

    @PostMapping("/logout")
    public Map<String, String> logout(Authentication authentication) {
        return auth.logout(authentication.getName());
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return auth.forgotPassword(request);
    }

    @PutMapping("/change-password")
    public Map<String, String> changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        return auth.changePassword(authentication.getName(), request);
    }
}
