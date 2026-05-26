package com.phishing.backend.repository;

import com.phishing.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

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

    // =========================
    // FIND USERS BY EMAIL
    // IGNORE CASE
    // =========================

    Optional<User> findByEmailIgnoreCase(
            String email
    );

    // =========================
    // COUNT USERS BY ROLE
    // =========================

    long countByRole(
            String role
    );

    // =========================
    // COUNT ACTIVE USERS
    // =========================

    long countByActive(
            boolean active
    );

    // =========================
    // FIND RECENT USERS
    // =========================

    List<User> findByCreatedAtAfter(
            LocalDateTime dateTime
    );

    // =========================
    // FIND USERS BY LOGIN COUNT
    // =========================

    List<User> findByLoginCountGreaterThan(
            Integer count
    );

    // =========================
    // FIND USERS BY LAST LOGIN
    // =========================

    List<User> findByLastLoginAtAfter(
            LocalDateTime dateTime
    );

    // =========================
    // FIND ACTIVE ADMINS
    // =========================

    List<User> findByRoleAndActive(

            String role,

            boolean active
    );
}