package com.phishing.backend.service;

import com.phishing.backend.entity.User;

import com.phishing.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    // =========================
    // LOAD USER BY EMAIL
    // =========================

    @Override

    public UserDetails loadUserByUsername(
            String email
    ) throws UsernameNotFoundException {

        // =========================
        // FIND USER
        // =========================

        User user = userRepository

                .findByEmail(
                        email.toLowerCase()
                )

                .orElseThrow(() ->

                        new UsernameNotFoundException(
                                "User Not Found"
                        )
                );

        // =========================
        // RETURN SPRING SECURITY USER
        // =========================

        return new org.springframework.security.core.userdetails.User(

                user.getEmail(),

                user.getPassword(),

                user.isActive(),

                true,

                true,

                true,

                Collections.singletonList(

                        new SimpleGrantedAuthority(
                                user.getRole()
                        )
                )
        );
    }
}