package com.phishing.backend.controller;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")

@CrossOrigin(origins = "http://localhost:3000")

public class DashboardController {

    // =========================
    // DASHBOARD API
    // =========================

    @GetMapping
    public ResponseEntity<?> dashboard() {

        // Dashboard Response

        Map<String, Object> response =
                new HashMap<>();

        // Basic Details

        response.put(
                "message",
                "Dashboard API Working Successfully"
        );

        response.put(
                "status",
                true
        );

        response.put(
                "timestamp",
                LocalDateTime.now()
        );

        // Dashboard Statistics

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
                15
        );

        // Return Response

        return ResponseEntity.ok(response);
    }
}