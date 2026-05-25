package com.phishing.backend.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class User {

    // Primary Key

    @Id
    @GeneratedValue(strategy =
            GenerationType.IDENTITY)
    private Long id;

    // User Name

    @Column(nullable = false)
    private String name;

    // User Email

    @Column(
            unique = true,
            nullable = false
    )
    private String email;

    // Password

    @Column(nullable = false)
    private String password;

    // USER / ADMIN

    @Column(nullable = false)
    private String role = "USER";

    // Account Status

    private boolean active = true;

    // Created Time

    private LocalDateTime createdAt =
            LocalDateTime.now();

    // Updated Time

    private LocalDateTime updatedAt =
            LocalDateTime.now();

    // Automatically Update Time

    @PreUpdate
    public void preUpdate() {

        updatedAt = LocalDateTime.now();
    }
}