package com.phishing.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blocked_domains")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockedDomain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Matches your repository lookup field name (domainOrIp)
    @Column(name = "domain_or_ip", nullable = false, unique = true)
    private String domainOrIp;

    @Column(nullable = false)
    private String type; // e.g., "URL", "IP", "EMAIL"

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Builder.Default
    @Column(name = "blocked_at")
    private LocalDateTime blockedAt = LocalDateTime.now();
}