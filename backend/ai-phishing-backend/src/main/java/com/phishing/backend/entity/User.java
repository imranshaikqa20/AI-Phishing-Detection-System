package com.phishing.backend.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity

@Table(
        name = "users"
)

@Data

@Builder

@NoArgsConstructor

@AllArgsConstructor

public class User {

    // =========================
    // PRIMARY KEY
    // =========================

    @Id

    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )

    private Long id;

    // =========================
    // USER NAME
    // =========================

    @Column(
            nullable = false,
            length = 100
    )

    private String name;

    // =========================
    // USER EMAIL
    // =========================

    @Column(
            unique = true,
            nullable = false,
            length = 150
    )

    private String email;

    // =========================
    // USER PASSWORD
    // =========================

    @Column(
            nullable = false,
            length = 255
    )

    private String password;

    // =========================
    // USER ROLE
    // ROLE_USER
    // ROLE_ADMIN
    // =========================

    @Builder.Default

    @Column(
            nullable = false,
            length = 30
    )

    private String role = "ROLE_USER";

    // =========================
    // ACCOUNT STATUS
    // =========================

    @Builder.Default

    @Column(nullable = false)

    private boolean active = true;

    // =========================
    // EMAIL VERIFIED
    // =========================

    @Builder.Default

    @Column(nullable = false)

    private boolean emailVerified = false;

    // =========================
    // LOGIN COUNT
    // =========================

    @Builder.Default

    @Column(nullable = false)

    private Integer loginCount = 0;

    // =========================
    // FAILED LOGIN ATTEMPTS
    // =========================

    @Builder.Default

    @Column(nullable = false)

    private Integer failedLoginAttempts = 0;

    // =========================
    // ACCOUNT LOCK STATUS
    // =========================

    @Builder.Default

    @Column(nullable = false)

    private boolean accountLocked = false;

    // =========================
    // LAST LOGIN TIME
    // =========================

    private LocalDateTime lastLoginAt;

    // =========================
    // PASSWORD UPDATED TIME
    // =========================

    private LocalDateTime passwordUpdatedAt;

    // =========================
    // ACCOUNT CREATED TIME
    // =========================

    @Builder.Default

    @Column(nullable = false)

    private LocalDateTime createdAt =
            LocalDateTime.now();

    // =========================
    // ACCOUNT UPDATED TIME
    // =========================

    @Builder.Default

    @Column(nullable = false)

    private LocalDateTime updatedAt =
            LocalDateTime.now();

    // =========================
    // AUTO CREATE TIMESTAMP
    // =========================

    @PrePersist

    public void prePersist() {

        if (createdAt == null) {

            createdAt =
                    LocalDateTime.now();
        }

        if (updatedAt == null) {

            updatedAt =
                    LocalDateTime.now();
        }

        if (passwordUpdatedAt == null) {

            passwordUpdatedAt =
                    LocalDateTime.now();
        }

        if (loginCount == null) {

            loginCount = 0;
        }

        if (failedLoginAttempts == null) {

            failedLoginAttempts = 0;
        }
    }

    // =========================
    // AUTO UPDATE TIMESTAMP
    // =========================

    @PreUpdate

    public void preUpdate() {

        updatedAt =
                LocalDateTime.now();
    }
}