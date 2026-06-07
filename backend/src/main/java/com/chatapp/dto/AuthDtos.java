package com.chatapp.dto;

import com.chatapp.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

public class AuthDtos {
    @Data
    public static class RegisterRequest {
        @NotBlank
        private String name;
        @Email
        @NotBlank
        private String email;
        @Size(min = 6)
        private String password;
    }

    @Data
    public static class LoginRequest {
        @Email
        @NotBlank
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class ForgotPasswordRequest {
        @Email
        @NotBlank
        private String email;
    }

    @Data
    public static class ChangePasswordRequest {
        private String currentPassword;
        @Size(min = 6)
        private String newPassword;
    }

    @Data
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private User user;
    }
}
