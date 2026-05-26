package com.phishing.backend.controller;

import com.phishing.backend.entity.User;

import com.phishing.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

import java.util.HashMap;
import java.util.Map;

@RestController

@RequestMapping("/api/dashboard")

@CrossOrigin(
        origins = "http://localhost:3000"
)

public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    // =========================
    // USER DASHBOARD API
    // =========================

    @PreAuthorize(

            "hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')"
    )

    @GetMapping

    public ResponseEntity<?> dashboard(

            Authentication authentication
    ) {

        // =========================
        // GET LOGGED USER
        // =========================

        String email =
                authentication.getName();

        User user = userRepository

                .findByEmailIgnoreCase(
                        email
                )

                .orElseThrow(() ->

                        new RuntimeException(
                                "User Not Found"
                        )
                );

        // =========================
        // DATABASE COUNTS
        // =========================

        long totalUsers =
                userRepository.count();

        long activeUsers =

                userRepository.countByActive(
                        true
                );

        long adminUsers =

                userRepository.countByRole(
                        "ROLE_ADMIN"
                );

        long normalUsers =

                userRepository.countByRole(
                        "ROLE_USER"
                );

        // =========================
        // DASHBOARD RESPONSE
        // =========================

        Map<String, Object> response =

                new HashMap<>();

        // =========================
        // BASIC RESPONSE
        // =========================

        response.put(
                "success",
                true
        );

        response.put(
                "message",
                "Dashboard Loaded Successfully"
        );

        response.put(
                "timestamp",
                LocalDateTime.now()
        );

        // =========================
        // USER DETAILS
        // =========================

        response.put(
                "name",
                user.getName()
        );

        response.put(
                "email",
                user.getEmail()
        );

        response.put(
                "role",
                user.getRole()
        );

        response.put(
                "loginCount",
                user.getLoginCount()
        );

        response.put(
                "lastLoginAt",
                user.getLastLoginAt()
        );

        response.put(
                "accountStatus",
                user.isActive()
        );

        // =========================
        // DASHBOARD STATS
        // =========================

        response.put(
                "totalScans",
                120
        );

        response.put(
                "safeUrls",
                80
        );

        response.put(
                "suspiciousUrls",
                40
        );

        response.put(
                "totalUsers",
                totalUsers
        );

        response.put(
                "activeUsers",
                activeUsers
        );

        response.put(
                "adminUsers",
                adminUsers
        );

        response.put(
                "normalUsers",
                normalUsers
        );

        // =========================
        // SECURITY STATUS
        // =========================

        response.put(
                "jwtAuthentication",
                true
        );

        response.put(
                "securityStatus",
                "SECURED"
        );

        // =========================
        // RETURN RESPONSE
        // =========================

        return ResponseEntity.ok(
                response
        );
    }
}