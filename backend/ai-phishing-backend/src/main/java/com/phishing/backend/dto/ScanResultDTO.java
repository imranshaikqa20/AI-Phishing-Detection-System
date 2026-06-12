package com.phishing.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScanResultDTO {

    private Long id;
    private String inputType;
    private String rawContent;
    private int overallRiskScore;
    private String verdict;
    private String aiSummary;
    private LocalDateTime scannedAt;
}