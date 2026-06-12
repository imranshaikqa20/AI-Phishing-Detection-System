package com.phishing.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "phishing_scans")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({
        "hibernateLazyInitializer",
        "handler"
})
public class PhishingScan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FIXED
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({
            "password",
            "hibernateLazyInitializer",
            "handler"
    })
    private User user;

    @Column(name = "input_type", nullable = false)
    private String inputType;

    @Column(name = "raw_content", nullable = false, columnDefinition = "TEXT")
    private String rawContent;

    @Column(name = "overall_risk_score", nullable = false)
    private int overallRiskScore;

    @Column(nullable = false)
    private String verdict;

    @Column(name = "ai_summary", columnDefinition = "TEXT")
    private String aiSummary;

    @JsonManagedReference
    @OneToMany(
            mappedBy = "phishingScan",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<AiAnalysisDetail> analysisDetails;

    @Builder.Default
    @Column(name = "scanned_at")
    private LocalDateTime scannedAt = LocalDateTime.now();
}