package com.phishing.backend.repository;

import com.phishing.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository
        extends JpaRepository<User, Long> {

    // =========================
    // FIND USER BY EMAIL
    // =========================

    Optional<User> findByEmail(
            String email
    );

    // =========================
    // CHECK EMAIL EXISTS
    // =========================

    boolean existsByEmail(
            String email
    );

    // =========================
    // FIND USERS BY ROLE
    // =========================

    List<User> findByRole(
            String role
    );

    // =========================
    // FIND ACTIVE USERS
    // =========================

    List<User> findByActive(
            boolean active
    );

    // =========================
    // SEARCH USER BY NAME
    // =========================

    List<User> findByNameContainingIgnoreCase(
            String name
    );
}