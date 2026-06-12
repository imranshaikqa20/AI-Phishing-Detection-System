package com.phishing.backend.controller;

import com.phishing.backend.dto.AuthRequest;
import com.phishing.backend.dto.AuthResponse;
import com.phishing.backend.dto.RegisterRequest;

import com.phishing.backend.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import java.util.HashMap;
import java.util.Map;

@RestController

@RequestMapping("/api/auth")

@CrossOrigin(
        origins = "http://localhost:3000"
)

public class AuthController {

    @Autowired
    private AuthService authService;

    // =========================
    // REGISTER API
    // =========================

    @PostMapping("/register")

    public ResponseEntity<?> register(

            @Valid

            @RequestBody
            RegisterRequest request
    ) {

        try {

            // =========================
            // REGISTER USER
            // =========================

            String response =

                    authService.register(
                            request
                    );

            // =========================
            // SUCCESS RESPONSE
            // =========================

            Map<String, Object> result =

                    new HashMap<>();

            result.put(
                    "success",
                    true
            );

            result.put(
                    "message",
                    response
            );

            result.put(
                    "timestamp",
                    LocalDateTime.now()
            );

            return ResponseEntity.ok(
                    result
            );

        } catch (Exception e) {

            // =========================
            // ERROR RESPONSE
            // =========================

            Map<String, Object> error =

                    new HashMap<>();

            error.put(
                    "success",
                    false
            );

            error.put(
                    "message",
                    e.getMessage()
            );

            error.put(
                    "timestamp",
                    LocalDateTime.now()
            );

            return ResponseEntity

                    .status(
                            HttpStatus.BAD_REQUEST
                    )

                    .body(error);
        }
    }

    // =========================
    // LOGIN API
    // =========================

    @PostMapping("/login")

    public ResponseEntity<?> login(

            @Valid

            @RequestBody
            AuthRequest request
    ) {

        try {

            // =========================
            // LOGIN USER
            // =========================

            AuthResponse response =

                    authService.login(
                            request
                    );

            // =========================
            // SUCCESS RESPONSE
            // =========================

            Map<String, Object> result =

                    new HashMap<>();

            result.put(
                    "success",
                    true
            );

            result.put(
                    "message",
                    response.getMessage()
            );

            result.put("id", response.getId());

            // =========================
            // JWT TOKEN
            // =========================

            result.put(
                    "token",
                    response.getToken()
            );

            // =========================
            // USER ROLE
            // =========================

            result.put(
                    "role",
                    response.getRole()
            );

            // =========================
            // USER DETAILS
            // =========================

            result.put(
                    "name",
                    response.getName()
            );

            result.put(
                    "email",
                    response.getEmail()
            );

            result.put(
                    "active",
                    response.isActive()
            );

            result.put(
                    "loginCount",
                    response.getLoginCount()
            );

            result.put(
                    "lastLoginAt",
                    response.getLastLoginAt()
            );

            result.put(
                    "timestamp",
                    LocalDateTime.now()
            );

            return ResponseEntity.ok(
                    result
            );

        } catch (Exception e) {

            // =========================
            // ERROR RESPONSE
            // =========================

            Map<String, Object> error =

                    new HashMap<>();

            error.put(
                    "success",
                    false
            );

            error.put(
                    "message",
                    e.getMessage()
            );

            error.put(
                    "timestamp",
                    LocalDateTime.now()
            );

            return ResponseEntity

                    .status(
                            HttpStatus.UNAUTHORIZED
                    )

                    .body(error);
        }
    }

    // =========================
    // HEALTH CHECK API
    // =========================

    @GetMapping("/health")

    public ResponseEntity<?> health() {

        Map<String, Object> response =

                new HashMap<>();

        response.put(
                "status",
                "UP"
        );

        response.put(
                "message",
                "Authentication Service Running"
        );

        response.put(
                "timestamp",
                LocalDateTime.now()
        );

        return ResponseEntity.ok(
                response
        );
    }

    // =========================
    // TEST SECURED API
    // =========================

    @GetMapping("/secure")

    public ResponseEntity<?> secureApi() {

        Map<String, Object> response =

                new HashMap<>();

        response.put(
                "message",
                "JWT Authentication Successful"
        );

        response.put(
                "status",
                "AUTHORIZED"
        );

        response.put(
                "timestamp",
                LocalDateTime.now()
        );

        return ResponseEntity.ok(
                response
        );
    }
}