package com.chatapp.service;

import com.chatapp.dto.AuthDtos.AuthResponse;
import com.chatapp.dto.AuthDtos.ChangePasswordRequest;
import com.chatapp.dto.AuthDtos.ForgotPasswordRequest;
import com.chatapp.dto.AuthDtos.LoginRequest;
import com.chatapp.dto.AuthDtos.RegisterRequest;
import com.chatapp.exception.ApiException;
import com.chatapp.model.User;
import com.chatapp.repository.UserRepository;
import com.chatapp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public AuthResponse register(RegisterRequest request) {
        String email = normalize(request.getEmail());
        if (users.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email already registered");
        }
        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .name(request.getName())
                .email(email)
                .password(encoder.encode(request.getPassword()))
                .bio("Available")
                .status(User.PresenceStatus.ONLINE)
                .createdAt(now)
                .updatedAt(now)
                .lastSeen(now)
                .desktopNotifications(true)
                .soundNotifications(true)
                .build();
        users.save(user);
        return new AuthResponse(jwt.generateToken(user.getEmail()), user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = users.findByEmail(normalize(request.getEmail()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        user.setStatus(User.PresenceStatus.ONLINE);
        user.setLastSeen(LocalDateTime.now());
        users.save(user);
        return new AuthResponse(jwt.generateToken(user.getEmail()), user);
    }

    public Map<String, String> logout(String email) {
        User user = users.findByEmail(email).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        user.setStatus(User.PresenceStatus.OFFLINE);
        user.setLastSeen(LocalDateTime.now());
        users.save(user);
        return Map.of("message", "Logged out");
    }

    public Map<String, String> forgotPassword(ForgotPasswordRequest request) {
        if (!users.existsByEmail(normalize(request.getEmail()))) {
            throw new ApiException(HttpStatus.NOT_FOUND, "No account found for this email");
        }
        return Map.of("message", "Password reset flow is ready to connect to your email provider");
    }

    public Map<String, String> changePassword(String email, ChangePasswordRequest request) {
        User user = users.findByEmail(email).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        users.save(user);
        return Map.of("message", "Password changed");
    }

    private String normalize(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
