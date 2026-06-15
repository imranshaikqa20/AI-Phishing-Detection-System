package com.phishing.backend.dto;

public record RiskFactorDetail(
        String riskFactor,
        String severity,
        String description
) {}