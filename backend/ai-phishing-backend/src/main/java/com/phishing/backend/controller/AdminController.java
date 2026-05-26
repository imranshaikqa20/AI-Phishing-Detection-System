package com.phishing.backend.controller;

import com.phishing.backend.entity.User;

import com.phishing.backend.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController

@RequestMapping("/api/admin")

@CrossOrigin(
        origins = "http://localhost:3000"
)

@PreAuthorize("hasAuthority('ROLE_ADMIN')")

public class AdminController {

    @Autowired
    private AuthService authService;

    // =========================
    // ADMIN ANALYTICS API
    // =========================

    @GetMapping("/analytics")

    public ResponseEntity<?> analytics() {

        try {

            List<User> users =
                    authService.getAllUsers();

            long totalUsers =
                    users.size();

            long activeUsers =

                    users.stream()

                            .filter(User::isActive)

                            .count();

            long adminUsers =

                    users.stream()

                            .filter(user ->

                                    user.getRole()
                                            .equals(
                                                    "ROLE_ADMIN"
                                            )
                            )

                            .count();

            long normalUsers =

                    users.stream()

                            .filter(user ->

                                    user.getRole()
                                            .equals(
                                                    "ROLE_USER"
                                            )
                            )

                            .count();

            long lockedUsers =

                    users.stream()

                            .filter(User::isAccountLocked)

                            .count();

            // =========================
            // RESPONSE
            // =========================

            Map<String, Object> result =

                    new HashMap<>();

            result.put(
                    "success",
                    true
            );

            result.put(
                    "totalUsers",
                    totalUsers
            );

            result.put(
                    "activeUsers",
                    activeUsers
            );

            result.put(
                    "adminUsers",
                    adminUsers
            );

            result.put(
                    "normalUsers",
                    normalUsers
            );

            result.put(
                    "lockedUsers",
                    lockedUsers
            );

            result.put(
                    "message",
                    "Admin Analytics Loaded Successfully"
            );

            result.put(
                    "timestamp",
                    LocalDateTime.now()
            );

            return ResponseEntity.ok(
                    result
            );

        } catch (Exception e) {

            return buildErrorResponse(
                    e.getMessage()
            );
        }
    }

    // =========================
    // GET ALL USERS
    // =========================

    @GetMapping("/users")

    public ResponseEntity<?> users() {

        try {

            List<User> users =
                    authService.getAllUsers();

            Map<String, Object> result =

                    new HashMap<>();

            result.put(
                    "success",
                    true
            );

            result.put(
                    "count",
                    users.size()
            );

            result.put(
                    "users",
                    users
            );

            result.put(
                    "timestamp",
                    LocalDateTime.now()
            );

            return ResponseEntity.ok(
                    result
            );

        } catch (Exception e) {

            return buildErrorResponse(
                    e.getMessage()
            );
        }
    }

    // =========================
    // DISABLE USER
    // =========================

    @PutMapping("/disable/{id}")

    public ResponseEntity<?> disableUser(

            @PathVariable
            Long id
    ) {

        try {

            String response =

                    authService.disableUser(
                            id
                    );

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

            return buildErrorResponse(
                    e.getMessage()
            );
        }
    }

    // =========================
    // ENABLE USER
    // =========================

    @PutMapping("/enable/{id}")

    public ResponseEntity<?> enableUser(

            @PathVariable
            Long id
    ) {

        try {

            String response =

                    authService.enableUser(
                            id
                    );

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

            return buildErrorResponse(
                    e.getMessage()
            );
        }
    }

    // =========================
    // DELETE USER
    // =========================

    @DeleteMapping("/delete/{id}")

    public ResponseEntity<?> deleteUser(

            @PathVariable
            Long id
    ) {

        try {

            String response =

                    authService.deleteUser(
                            id
                    );

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

            return buildErrorResponse(
                    e.getMessage()
            );
        }
    }

    // =========================
    // REPORTS API
    // =========================

    @GetMapping("/reports")

    public ResponseEntity<?> reports() {

        Map<String, Object> result =

                new HashMap<>();

        result.put(
                "success",
                true
        );

        result.put(
                "message",
                "Admin Reports Loaded"
        );

        result.put(
                "reports",
                "Phishing reports will appear here"
        );

        result.put(
                "timestamp",
                LocalDateTime.now()
        );

        return ResponseEntity.ok(
                result
        );
    }

    // =========================
    // SUSPICIOUS ACTIVITY API
    // =========================

    @GetMapping("/suspicious")

    public ResponseEntity<?> suspiciousActivity() {

        Map<String, Object> result =

                new HashMap<>();

        result.put(
                "success",
                true
        );

        result.put(
                "message",
                "Suspicious Activity Loaded"
        );

        result.put(
                "activities",
                "High-risk URLs and malware scan data"
        );

        result.put(
                "timestamp",
                LocalDateTime.now()
        );

        return ResponseEntity.ok(
                result
        );
    }

    // =========================
    // ERROR RESPONSE METHOD
    // =========================

    private ResponseEntity<?> buildErrorResponse(
            String message
    ) {

        Map<String, Object> error =

                new HashMap<>();

        error.put(
                "success",
                false
        );

        error.put(
                "message",
                message
        );

        error.put(
                "timestamp",
                LocalDateTime.now()
        );

        return ResponseEntity

                .status(
                        HttpStatus.INTERNAL_SERVER_ERROR
                )

                .body(error);
    }
}