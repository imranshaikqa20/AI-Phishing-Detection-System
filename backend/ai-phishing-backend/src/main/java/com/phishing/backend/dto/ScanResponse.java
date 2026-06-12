package com.phishing.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScanResponse {

    // PHISHING STATUS
    private boolean phishing;

    // RISK SCORE
    private int score;

    // SHORT MESSAGE
    private String message;

    // DETAILED ANALYSIS
    private String details;
}