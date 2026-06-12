package com.phishing.backend.controller;

import com.phishing.backend.dto.ScanResponse;
import com.phishing.backend.dto.ScanResultDTO;
import com.phishing.backend.entity.AiAnalysisDetail;
import com.phishing.backend.entity.PhishingScan;
import com.phishing.backend.entity.ReportedThreat;
import com.phishing.backend.entity.User;
import com.phishing.backend.repository.PhishingScanRepository;
import com.phishing.backend.repository.ReportedThreatRepository;
import com.phishing.backend.repository.UserRepository;
import com.phishing.backend.service.PhishingAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/scan")
@CrossOrigin(origins = "http://localhost:3000")
public class ScanController {

    @Autowired
    private PhishingAiService phishingAiService;

    @Autowired
    private PhishingScanRepository phishingScanRepository;

    @Autowired
    private ReportedThreatRepository reportedThreatRepository;

    @Autowired
    private UserRepository userRepository;

    // ANALYZE CONTENT
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzePayload(
            @RequestBody Map<String, Object> request) {

        String type       = (String) request.getOrDefault("type", "TEXT");
        String rawContent = (String) request.get("content");
        Object userIdObj  = request.get("userId");

        if (userIdObj == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "User ID is required"));
        }

        Long userId = Long.valueOf(userIdObj.toString());

        if (rawContent == null || rawContent.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Content cannot be empty"));
        }

        try {

            // ── USER + QUOTA VALIDATION ──
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }

            User user = userOptional.get();
            LocalDate today = LocalDate.now();

            // Day rollover — reset counter if calendar day has flipped
            if (user.getLastScanDate() == null
                    || user.getLastScanDate().toLocalDate().isBefore(today)) {
                user.setScansToday(0);
                user.setLastScanDate(LocalDateTime.now());
            }

            // Free plan quota check
            if (!user.isPro() && user.getScansToday() >= 100) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of(
                        "success",         false,
                        "message",         "Daily scan limit reached. Upgrade to Pro for unlimited scans.",
                        "requiresUpgrade", true
                ));
            }

            // ── AI ANALYSIS ──
            ScanResponse aiResult = phishingAiService.analyzeContent(type, rawContent);

            // ── PERSIST SCAN ──
            PhishingScan scan = PhishingScan.builder()
                    .user(user)
                    .inputType(type)
                    .rawContent(rawContent)
                    .overallRiskScore(aiResult.getScore())
                    .verdict(aiResult.isPhishing() ? "PHISHING" : "SAFE")
                    .aiSummary(aiResult.getDetails())
                    .build();

            AiAnalysisDetail detail = AiAnalysisDetail.builder()
                    .phishingScan(scan)
                    .riskFactor(aiResult.getMessage())
                    .severity(aiResult.isPhishing() ? "HIGH" : "LOW")
                    .description(aiResult.getDetails())
                    .build();

            scan.setAnalysisDetails(List.of(detail));
            PhishingScan savedScan = phishingScanRepository.save(scan);

            // ── UPDATE USER COUNTERS ──
            user.setScansToday(user.getScansToday() + 1);
            user.setTotalScans(user.getTotalScans() + 1);
            user.setLastScanDate(LocalDateTime.now());
            userRepository.save(user);

            int remainingScans = user.isPro() ? 999999 : (100 - user.getScansToday());

            // ── RETURN DTO — never the raw entity ──
            return ResponseEntity.ok(Map.of(
                    "scanResult", toDTO(savedScan),
                    "subscriptionMetrics", Map.of(
                            "isPro",          user.isPro(),
                            "scansToday",     user.getScansToday(),
                            "remainingScans", remainingScans
                    )
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success",  false,
                    "message",  "AI Analysis failed: " + e.getMessage()
            ));
        }
    }

    // SCAN HISTORY
    // Returns DTOs — never raw entities
    @GetMapping("/history")
    public ResponseEntity<List<ScanResultDTO>> getScanHistory() {
        try {
            List<ScanResultDTO> history = phishingScanRepository
                    .findAllByOrderByScannedAtDesc()
                    .stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(history);

        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // UPLOAD AND SCAN FILE
    @PostMapping("/upload")
    public ResponseEntity<?> uploadAndAnalyzePayload(
            @RequestParam("file")                               MultipartFile file,
            @RequestParam("userId")                             Long userId,
            @RequestParam(value = "type", defaultValue = "TEXT") String type) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Uploaded file is empty or missing."));
        }

        try {
            String fileContent = new BufferedReader(
                    new InputStreamReader(file.getInputStream()))
                    .lines()
                    .collect(Collectors.joining("\n"));

            // Strip null bytes that crash PostgreSQL UTF-8
            fileContent = fileContent.replace("\u0000", "").trim();

            if (fileContent.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "File is empty after parsing."));
            }

            Map<String, Object> internalRequest = Map.of(
                    "userId",  userId,
                    "type",    type,
                    "content", fileContent
            );

            return this.analyzePayload(internalRequest);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to process file: " + e.getMessage()
            ));
        }
    }

    // DASHBOARD METRICS
    @GetMapping("/metrics")
    public ResponseEntity<?> getDashboardStats(Authentication authentication) {
        try {
            Map<String, Object> rawMetrics =
                    phishingScanRepository.getGlobalDashboardMetrics();

            Map<String, Object> formattedMetrics = new HashMap<>();
            formattedMetrics.put("totalScans",      rawMetrics.getOrDefault("total_scans",      0));
            formattedMetrics.put("totalEmailsScan", rawMetrics.getOrDefault("total_emails",     0));
            formattedMetrics.put("totalUrlsScan",   rawMetrics.getOrDefault("total_urls",       0));
            formattedMetrics.put("phishingEmails",  rawMetrics.getOrDefault("phishing_emails",  0));
            formattedMetrics.put("phishingUrls",    rawMetrics.getOrDefault("phishing_urls",    0));

            if (authentication != null && authentication.getName() != null) {
                userRepository.findByEmail(authentication.getName()).ifPresent(user -> {
                    formattedMetrics.put("isPro",          user.isPro());
                    formattedMetrics.put("scansToday",     user.getScansToday());
                    formattedMetrics.put("remainingScans",
                            user.isPro() ? 999999 : (100 - user.getScansToday()));
                });
            }

            return ResponseEntity.ok(formattedMetrics);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Failed to load metrics: " + e.getMessage()
            ));
        }
    }

    // PRIVATE MAPPER — entity → DTO
    // Reads only simple column fields.
    // Never touches analysisDetails or user
    // so LazyInitializationException is gone.
    private ScanResultDTO toDTO(PhishingScan scan) {
        return ScanResultDTO.builder()
                .id(scan.getId())
                .inputType(scan.getInputType())
                .rawContent(scan.getRawContent())
                .overallRiskScore(scan.getOverallRiskScore())
                .verdict(scan.getVerdict())
                .aiSummary(scan.getAiSummary())
                .scannedAt(scan.getScannedAt())
                .build();
    }

    @PostMapping("/report")
    public ResponseEntity<?> reportThreat(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String threatValue = (String) request.get("threatValue");
            String type = (String) request.get("type");
            String reason = (String) request.get("reason");

            // Build and save the report
            ReportedThreat report = ReportedThreat.builder()
                    .userId(userId)
                    .threatValue(threatValue)
                    .type(type)
                    .reason(reason)
                    .reportedAt(LocalDateTime.now())
                    .build();

            reportedThreatRepository.save(report);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Threat reported successfully. Thank you for helping keep the community safe."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Report failed: " + e.getMessage()));
        }
    }
}