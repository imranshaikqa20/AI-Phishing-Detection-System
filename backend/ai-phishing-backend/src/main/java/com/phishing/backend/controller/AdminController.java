package com.phishing.backend.controller;

import com.phishing.backend.entity.BlockedDomain;
import com.phishing.backend.entity.User;
import com.phishing.backend.repository.BlockedDomainRepository;
import com.phishing.backend.repository.PhishingScanRepository;
import com.phishing.backend.repository.ReportedThreatRepository;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private AuthService authService;

    @Autowired
    private PhishingScanRepository phishingScanRepository;

    @Autowired
    private BlockedDomainRepository blockedDomainRepository;

    @Autowired
    private ReportedThreatRepository reportedThreatRepository;

    // ADMIN ANALYTICS
    // Real user counts + real scan metrics
    @GetMapping("/analytics")
    public ResponseEntity<?> analytics() {
        try {
            List<User> users = authService.getAllUsers();

            // ── USER COUNTS ──
            long totalUsers  = users.size();
            long activeUsers = users.stream().filter(User::isActive).count();
            long adminUsers  = users.stream().filter(u -> u.getRole().equals("ROLE_ADMIN")).count();
            long normalUsers = users.stream().filter(u -> u.getRole().equals("ROLE_USER")).count();
            long lockedUsers = users.stream().filter(User::isAccountLocked).count();

            // ── REAL SCAN METRICS from DB ──
            Map<String, Object> scanMetrics =
                    phishingScanRepository.getGlobalDashboardMetrics();

            Map<String, Object> result = new HashMap<>();
            result.put("success",     true);

            // User stats
            result.put("totalUsers",  totalUsers);
            result.put("activeUsers", activeUsers);
            result.put("adminUsers",  adminUsers);
            result.put("normalUsers", normalUsers);
            result.put("lockedUsers", lockedUsers);

            // Scan stats — toLong() handles PostgreSQL
            // BigInteger/BigDecimal cast from native queries
            result.put("totalScans",     toLong(scanMetrics.getOrDefault("total_scans",     0)));
            result.put("totalPhishing",  toLong(scanMetrics.getOrDefault("total_phishing",  0)));
            result.put("totalSafe",      toLong(scanMetrics.getOrDefault("total_safe",      0)));
            result.put("totalEmails",    toLong(scanMetrics.getOrDefault("total_emails",    0)));
            result.put("totalUrls",      toLong(scanMetrics.getOrDefault("total_urls",      0)));
            result.put("phishingEmails", toLong(scanMetrics.getOrDefault("phishing_emails", 0)));
            result.put("phishingUrls",   toLong(scanMetrics.getOrDefault("phishing_urls",   0)));
            result.put("highRiskScans",  toLong(scanMetrics.getOrDefault("high_risk_scans", 0)));
            result.put("avgRiskScore",   toLong(scanMetrics.getOrDefault("avg_risk_score",  0)));
            result.put("totalAnalyses",  toLong(scanMetrics.getOrDefault("total_analyses",  0)));

            result.put("message",    "Admin Analytics Loaded Successfully");
            result.put("timestamp",  LocalDateTime.now());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return buildErrorResponse(e.getMessage());
        }
    }

    // GET ALL USERS
    // Returns UserDTO — never raw User entity.
    // Raw User has lazy List<PhishingScan> scans
    // which causes LazyInitializationException.
    @GetMapping("/users")
    public ResponseEntity<?> users() {
        try {
            List<Map<String, Object>> userDTOs = authService.getAllUsers()
                    .stream()
                    .map(this::toUserDTO)
                    .collect(Collectors.toList());

            Map<String, Object> result = new HashMap<>();
            result.put("success",   true);
            result.put("count",     userDTOs.size());
            result.put("users",     userDTOs);
            result.put("timestamp", LocalDateTime.now());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return buildErrorResponse(e.getMessage());
        }
    }

    // DISABLE USER
    @PutMapping("/disable/{id}")
    public ResponseEntity<?> disableUser(@PathVariable Long id) {
        try {
            String response = authService.disableUser(id);

            Map<String, Object> result = new HashMap<>();
            result.put("success",   true);
            result.put("message",   response);
            result.put("timestamp", LocalDateTime.now());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return buildErrorResponse(e.getMessage());
        }
    }

    // ENABLE USER
    @PutMapping("/enable/{id}")
    public ResponseEntity<?> enableUser(@PathVariable Long id) {
        try {
            String response = authService.enableUser(id);

            Map<String, Object> result = new HashMap<>();
            result.put("success",   true);
            result.put("message",   response);
            result.put("timestamp", LocalDateTime.now());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return buildErrorResponse(e.getMessage());
        }
    }

    // DELETE USER
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            String response = authService.deleteUser(id);

            Map<String, Object> result = new HashMap<>();
            result.put("success",   true);
            result.put("message",   response);
            result.put("timestamp", LocalDateTime.now());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return buildErrorResponse(e.getMessage());
        }
    }

    // REPORTS
    /*@GetMapping("/reports")
    public ResponseEntity<?> reports() {
        Map<String, Object> result = new HashMap<>();
        result.put("success",   true);
        result.put("message",   "Admin Reports Loaded");
        result.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(result);
    }*/

    // SUSPICIOUS ACTIVITY
    @GetMapping("/suspicious")
    public ResponseEntity<?> suspiciousActivity() {
        Map<String, Object> result = new HashMap<>();
        result.put("success",    true);
        result.put("message",    "Suspicious Activity Loaded");
        result.put("timestamp",  LocalDateTime.now());
        return ResponseEntity.ok(result);
    }

    // PRIVATE MAPPER — User entity → safe DTO
    // Only maps simple column fields.
    // Never touches List<PhishingScan> scans
    // so LazyInitializationException is gone.
    private Map<String, Object> toUserDTO(User user) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id",            user.getId());
        dto.put("name",          user.getName());
        dto.put("email",         user.getEmail());
        dto.put("role",          user.getRole());
        dto.put("active",        user.isActive());
        dto.put("pro",           user.isPro());
        dto.put("loginCount",    user.getLoginCount());
        dto.put("totalScans",    user.getTotalScans());
        dto.put("scansToday",    user.getScansToday());
        dto.put("accountLocked", user.isAccountLocked());
        dto.put("lastLoginAt",   user.getLastLoginAt() != null
                ? user.getLastLoginAt().toString() : null);
        dto.put("createdAt",     user.getCreatedAt() != null
                ? user.getCreatedAt().toString() : null);
        return dto;
    }

    // SAFE CAST HELPER
    // PostgreSQL native queries return
    // BigInteger for COUNT() and BigDecimal
    // for AVG() — not Long or Integer.
    // This handles all numeric types safely.
    private long toLong(Object value) {
        if (value == null)            return 0L;
        if (value instanceof Long)    return (Long) value;
        if (value instanceof Integer) return ((Integer) value).longValue();
        if (value instanceof Number)  return ((Number) value).longValue();
        try { return Long.parseLong(value.toString()); }
        catch (NumberFormatException e) { return 0L; }
    }

    // ERROR RESPONSE
    private ResponseEntity<?> buildErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success",   false);
        error.put("message",   message);
        error.put("timestamp", LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }


    @PostMapping("/blocklist/add")
    public ResponseEntity<?> addToBlocklist(@RequestBody BlockedDomain domain) {
        blockedDomainRepository.save(domain);
        return ResponseEntity.ok(Map.of("success", true, "message", "Domain/IP added to blocklist"));
    }

    // REPORTS - Now fully functional and backed by database
    @GetMapping("/reports")
    public ResponseEntity<?> getReports() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "reports", reportedThreatRepository.findAllByOrderByReportedAtDesc(),
                "timestamp", LocalDateTime.now()
        ));
    }

    @PostMapping("/reports/{id}/approve")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> approveReport(@PathVariable Long id) {
        return reportedThreatRepository.findById(id).map(threat -> {
            // 1. Move to Blocklist
            BlockedDomain newBlock = BlockedDomain.builder()
                    .domainOrIp(threat.getThreatValue())
                    .type(threat.getType())
                    .reason("Approved from report: " + threat.getReason())
                    .blockedAt(LocalDateTime.now())
                    .build();

            blockedDomainRepository.save(newBlock);

            // 2. Remove from Reports queue
            reportedThreatRepository.deleteById(id);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Threat blocked and report resolved."
            ));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Report not found")));
    }


    @DeleteMapping("/reports/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        if (reportedThreatRepository.existsById(id)) {
            reportedThreatRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Report deleted/rejected."));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "Report not found."));
    }

    // View all blocked items
    @GetMapping("/blocklist")
    public ResponseEntity<?> getBlocklist() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "blocklist", blockedDomainRepository.findAll()
        ));
    }

    // Remove an item from the blocklist (Unblock)
    @DeleteMapping("/blocklist/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> removeFromBlocklist(@PathVariable Long id) {
        if (blockedDomainRepository.existsById(id)) {
            blockedDomainRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Domain/IP removed from blocklist."));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "Blocklist item not found."));
    }
}