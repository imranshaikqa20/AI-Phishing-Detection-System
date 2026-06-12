package com.phishing.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.phishing.backend.dto.ScanResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PhishingAiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // MAIN AI ANALYSIS (STRICT JSON MODE)
    public ScanResponse analyzeContent(String type, String content) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                    + model
                    + ":generateContent?key="
                    + apiKey;

            System.out.println("Calling Gemini API in Strict JSON Mode...");

            String prompt = """
                    You are an advanced AI Cybersecurity Threat Detection System.
                    Analyze the following content deeply for security threats.

                    INPUT TYPE: %s
                    CONTENT: %s

                    You must respond ONLY with a single valid JSON object. Do not wrap the JSON output in markdown backticks or markdown formatting.
                    Match this exact schema structure:
                    {
                      "verdict": "SAFE" or "SUSPICIOUS" or "PHISHING",
                      "riskScore": 0-100 (integer),
                      "message": "Short threat summary statement",
                      "details": "At least 12-15 lines of deep technical analysis, indicators, social engineering details, and recommendations."
                    }
                    """.formatted(type, content);

            // Setup payload structure
            Map<String, Object> textMap = Map.of("text", prompt);
            Map<String, Object> partsMap = Map.of("parts", List.of(textMap));

            // Core Gemini Engine configurations to force JSON return
            Map<String, Object> generationConfig = Map.of(
                    "responseMimeType", "application/json"
            );

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(partsMap));
            requestBody.put("generationConfig", generationConfig);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");

            if (candidates.isMissingNode() || candidates.isEmpty()) {
                return advancedFallbackAnalysis(content);
            }

            // Extract content string (guaranteed to be structured JSON text by Gemini)
            String rawJsonText = candidates.get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText()
                    .trim();

            // Direct mapping of structural fields
            JsonNode resultNode = objectMapper.readTree(rawJsonText);
            String verdict = resultNode.path("verdict").asText("SAFE").toUpperCase();
            int score = resultNode.path("riskScore").asInt(50);
            String message = resultNode.path("message").asText("Analysis Completed");
            String details = resultNode.path("details").asText("");

            boolean isPhishing = !verdict.equals("SAFE");

            return ScanResponse.builder()
                    .phishing(isPhishing)
                    .score(score)
                    .message(message)
                    .details(details)
                    .build();

        } catch (Exception e) {
            System.err.println("Gemini Integration Failed: " + e.getMessage());
            return advancedFallbackAnalysis(content);
        }
    }

    // ADVANCED FALLBACK ANALYSIS
    private ScanResponse advancedFallbackAnalysis(String content) {
        String lower = content.toLowerCase();
        int score = 0;
        StringBuilder threats = new StringBuilder();

        String[] highRisk = {
                "paypal", "bank", "verify", "urgent", "password", "login", "otp",
                "credit card", "bitcoin", "wallet", "security alert", "account suspended",
                "reward", "click here"
        };

        for (String word : highRisk) {
            if (lower.contains(word)) {
                score += 8;
                threats.append("- High risk keyword detected: ").append(word).append("\n");
            }
        }

        if (lower.contains("http://")) {
            score += 20;
            threats.append("- Unsafe HTTP protocol detected\n");
        }

        String[] domains = { ".xyz", ".ru", ".tk", ".click", ".top" };
        for (String domain : domains) {
            if (lower.contains(domain)) {
                score += 15;
                threats.append("- Suspicious domain detected: ").append(domain).append("\n");
            }
        }

        if (lower.contains("meeting") || lower.contains("schedule") || lower.contains("project") || lower.contains("thanks")) {
            score -= 20;
        }

        score = Math.max(0, Math.min(100, score));

        String verdict = score >= 70 ? "PHISHING" : (score >= 40 ? "SUSPICIOUS" : "SAFE");
        boolean phishing = !verdict.equals("SAFE");

        String summary = "VERDICT:\n" + verdict + "\n\n"
                + "RISK_SCORE:\n" + score + "/100\n\n"
                + "AI_SECURITY_ANALYSIS:\n"
                + (phishing ? "The content contains multiple suspicious phishing indicators including social engineering patterns."
                : "The content appears mostly legitimate with no major phishing indicators detected.")
                + "\n\n"
                + "THREATS_FOUND:\n" + (threats.length() == 0 ? "No major threats detected." : threats.toString()) + "\n"
                + "SECURITY_RECOMMENDATIONS:\n"
                + "1. Avoid suspicious links\n"
                + "2. Never share passwords or OTPs\n"
                + "3. Verify official domains carefully";

        return ScanResponse.builder()
                .phishing(phishing)
                .score(score)
                .message(verdict)
                .details(summary)
                .build();
    }
}