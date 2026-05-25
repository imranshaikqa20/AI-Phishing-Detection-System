package com.phishing.backend.controller;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/scan")

@CrossOrigin(origins = "http://localhost:3000")

public class ScanController {

    // =========================
    // URL SCANNER API
    // =========================

    @PostMapping("/url")

    public ResponseEntity<?> scanUrl(

            @RequestBody String url
    ) {

        // Response Object

        Map<String, Object> response =
                new HashMap<>();

        // Remove Extra Quotes

        url = url.replace("\"", "");

        // Default Values

        String status = "Safe";

        String riskLevel = "Low";

        String recommendation =
                "This URL looks safe to visit.";

        // Simple Phishing Detection Logic

        if (

                url.contains("login")

                        || url.contains("verify")

                        || url.contains("bank")

                        || url.contains("free")

                        || url.contains("secure")

                        || url.contains("update")

                        || url.contains("paypal")

                        || url.contains("otp")

                        || url.contains("gift")

        ) {

            status = "Suspicious";

            riskLevel = "High";

            recommendation =
                    "Avoid visiting this website. Possible phishing detected.";
        }

        // Build Response

        response.put(
                "url",
                url
        );

        response.put(
                "status",
                status
        );

        response.put(
                "riskLevel",
                riskLevel
        );

        response.put(
                "recommendation",
                recommendation
        );

        response.put(
                "timestamp",
                LocalDateTime.now()
        );

        response.put(
                "success",
                true
        );

        // Return Response

        return ResponseEntity.ok(response);
    }

    // =========================
    // HEALTH CHECK API
    // =========================

    @GetMapping("/health")

    public ResponseEntity<?> healthCheck() {

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "status",
                "API Running Successfully"
        );

        response.put(
                "success",
                true
        );

        response.put(
                "timestamp",
                LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }
}