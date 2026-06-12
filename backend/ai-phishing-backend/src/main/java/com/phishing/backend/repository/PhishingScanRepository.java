package com.phishing.backend.repository;

import com.phishing.backend.entity.PhishingScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface PhishingScanRepository extends JpaRepository<PhishingScan, Long> {

    // FETCH ALL SCANS — newest first
    List<PhishingScan> findAllByOrderByScannedAtDesc();

    // FETCH SCANS BY USER — newest first
    List<PhishingScan> findByUserIdOrderByScannedAtDesc(Long userId);

    // COUNT SCANS BY USER
    long countByUserId(Long userId);

    // GLOBAL DASHBOARD METRICS
    @Query(value = """
            SELECT
                COUNT(*)                                                        AS total_scans,
                COUNT(CASE WHEN input_type = 'TEXT'
                           OR  input_type = 'EMAIL'  THEN 1 END)               AS total_emails,
                COUNT(CASE WHEN input_type = 'URL'   THEN 1 END)               AS total_urls,
                COUNT(CASE WHEN verdict    = 'PHISHING' THEN 1 END)            AS total_phishing,
                COUNT(CASE WHEN verdict    = 'SAFE'     THEN 1 END)            AS total_safe,
                COUNT(CASE WHEN input_type = 'TEXT'
                           OR  input_type = 'EMAIL'
                           AND verdict    = 'PHISHING'  THEN 1 END)            AS phishing_emails,
                COUNT(CASE WHEN input_type = 'URL'
                           AND verdict    = 'PHISHING'  THEN 1 END)            AS phishing_urls,
                COUNT(CASE WHEN overall_risk_score >= 70 THEN 1 END)           AS high_risk_scans,
                COALESCE(ROUND(AVG(overall_risk_score), 0), 0)                 AS avg_risk_score,
                COUNT(*)                                                        AS total_analyses
            FROM phishing_scans
            """,
            nativeQuery = true)
    Map<String, Object> getGlobalDashboardMetrics();
}