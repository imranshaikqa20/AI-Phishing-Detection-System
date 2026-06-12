package com.phishing.backend.controller;

import com.phishing.backend.entity.User;
import com.phishing.backend.repository.PhishingScanRepository;
import com.phishing.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PhishingScanRepository phishingScanRepository;

    // USER DASHBOARD
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<?> dashboard(Authentication authentication) {

        try {

            // ── LOAD LOGGED IN USER ──
            String email = authentication.getName();

            User user = userRepository
                    .findByEmailIgnoreCase(email)
                    .orElseThrow(() ->
                            new RuntimeException("User Not Found"));

            // ── GLOBAL USER COUNTS ──
            long totalUsers  = userRepository.count();
            long activeUsers = userRepository.countByActive(true);
            long adminUsers  = userRepository.countByRole("ROLE_ADMIN");
            long normalUsers = userRepository.countByRole("ROLE_USER");

            // ── REAL GLOBAL SCAN METRICS ──
            Map<String, Object> scanMetrics =
                    phishingScanRepository.getGlobalDashboardMetrics();

            long totalScans    = toLong(scanMetrics.getOrDefault("total_scans",    0));
            long totalSafe     = toLong(scanMetrics.getOrDefault("total_safe",     0));
            long totalPhishing = toLong(scanMetrics.getOrDefault("total_phishing", 0));
            long phishingEmails = toLong(scanMetrics.getOrDefault("phishing_emails", 0));
            long phishingUrls   = toLong(scanMetrics.getOrDefault("phishing_urls",   0));
            long highRiskScans  = toLong(scanMetrics.getOrDefault("high_risk_scans", 0));
            long avgRiskScore   = toLong(scanMetrics.getOrDefault("avg_risk_score",  0));

            // ── USER-SPECIFIC SCAN COUNT ──
            long userTotalScans = phishingScanRepository.countByUserId(user.getId());

            // ── BUILD RESPONSE ──
            Map<String, Object> response = new HashMap<>();

            // Status
            response.put("success",   true);
            response.put("message",   "Dashboard Loaded Successfully");
            response.put("timestamp", LocalDateTime.now());

            // User details
            response.put("name",         user.getName());
            response.put("email",        user.getEmail());
            response.put("role",         user.getRole());
            response.put("isPro",        user.isPro());
            response.put("loginCount",   user.getLoginCount());
            response.put("lastLoginAt",  user.getLastLoginAt() != null
                    ? user.getLastLoginAt().toString() : null);
            response.put("accountStatus", user.isActive());
            response.put("scansToday",   user.getScansToday());
            response.put("remainingScans", user.isPro()
                    ? 999999 : Math.max(0, 100 - user.getScansToday()));

            // User-specific scan stats
            response.put("userTotalScans", userTotalScans);

            // Global platform scan stats — real data from DB
            response.put("totalScans",     totalScans);
            response.put("safeUrls",       totalSafe);
            response.put("suspiciousUrls", totalPhishing);
            response.put("phishingEmails", phishingEmails);
            response.put("phishingUrls",   phishingUrls);
            response.put("highRiskScans",  highRiskScans);
            response.put("avgRiskScore",   avgRiskScore);

            // Platform user stats
            response.put("totalUsers",   totalUsers);
            response.put("activeUsers",  activeUsers);
            response.put("adminUsers",   adminUsers);
            response.put("normalUsers",  normalUsers);

            // Security status
            response.put("jwtAuthentication", true);
            response.put("securityStatus",    "SECURED");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success",   false);
            error.put("message",   e.getMessage());
            error.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(500).body(error);
        }
    }

    // SAFE CAST HELPER
    // PostgreSQL native queries return
    // BigInteger/BigDecimal for COUNT/AVG,
    // not Long/Integer — this handles both.
    private long toLong(Object value) {
        if (value == null) return 0L;
        if (value instanceof Long)    return (Long) value;
        if (value instanceof Integer) return ((Integer) value).longValue();
        if (value instanceof Number)  return ((Number) value).longValue();
        try { return Long.parseLong(value.toString()); }
        catch (NumberFormatException e) { return 0L; }
    }
}