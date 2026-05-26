package com.phishing.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

@Builder

@NoArgsConstructor

@AllArgsConstructor

public class AuthResponse {

    // =========================
    // RESPONSE STATUS
    // =========================

    private boolean success;

    // =========================
    // RESPONSE MESSAGE
    // =========================

    private String message;

    // =========================
    // JWT TOKEN
    // =========================

    private String token;

    // =========================
    // TOKEN TYPE
    // =========================

    @Builder.Default

    private String tokenType = "Bearer";

    // =========================
    // USER ROLE
    // ROLE_USER
    // ROLE_ADMIN
    // =========================

    private String role;

    // =========================
    // USER NAME
    // =========================

    private String name;

    // =========================
    // USER EMAIL
    // =========================

    private String email;

    // =========================
    // ACCOUNT STATUS
    // =========================

    private boolean active;

    // =========================
    // LOGIN COUNT
    // =========================

    private int loginCount;

    // =========================
    // LAST LOGIN TIME
    // =========================

    private String lastLoginAt;

    // =========================
    // OPTIONAL REFRESH TOKEN
    // =========================

    private String refreshToken;
}