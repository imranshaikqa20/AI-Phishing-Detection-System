package com.phishing.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reported_threats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportedThreat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "threat_value", nullable = false)
    private String threatValue; // The domain, IP, or raw email flagged by the user

    @Column(nullable = false)
    private String type; // "URL", "IP", "EMAIL"

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Builder.Default
    @Column(name = "reported_at")
    private LocalDateTime reportedAt = LocalDateTime.now();
}