package com.phishing.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

@Builder

@NoArgsConstructor

@AllArgsConstructor

public class RegisterRequest {

    // =========================
    // USER NAME
    // =========================

    @NotBlank(
            message = "Name is required"
    )

    @Size(
            min = 3,
            max = 50,
            message =
                    "Name must be between 3 and 50 characters"
    )

    private String name;

    // =========================
    // USER EMAIL
    // =========================

    @NotBlank(
            message = "Email is required"
    )

    @Email(
            message = "Invalid email format"
    )

    private String email;

    // =========================
    // USER PASSWORD
    // =========================

    @NotBlank(
            message = "Password is required"
    )

    @Size(
            min = 6,
            message =
                    "Password must be at least 6 characters"
    )

    @Pattern(

            regexp =
                    "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=!]).{6,}$",

            message =
                    "Password must contain uppercase, lowercase, number and special character"
    )

    private String password;

    // =========================
    // USER ROLE
    // =========================

    @NotBlank(
            message = "Role is required"
    )

    @Pattern(
            regexp = "ROLE_USER|ROLE_ADMIN",
            message =
                    "Role must be ROLE_USER or ROLE_ADMIN"
    )

    private String role;
}