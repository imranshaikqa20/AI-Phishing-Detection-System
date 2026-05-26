package com.phishing.backend.security;

import com.phishing.backend.jwt.JwtAuthenticationEntryPoint;
import com.phishing.backend.jwt.JwtAuthenticationFilter;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration

@EnableMethodSecurity

public class SecurityConfig {

    // =========================
    // JWT AUTH FILTER
    // =========================

    @Autowired
    private JwtAuthenticationFilter
            jwtAuthenticationFilter;

    // =========================
    // JWT ENTRY POINT
    // =========================

    @Autowired
    private JwtAuthenticationEntryPoint
            jwtAuthenticationEntryPoint;

    // =========================
    // PASSWORD ENCODER
    // =========================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    // =========================
    // AUTHENTICATION MANAGER
    // =========================

    @Bean
    public AuthenticationManager authenticationManager(

            AuthenticationConfiguration config

    ) throws Exception {

        return config.getAuthenticationManager();
    }

    // =========================
    // SECURITY FILTER CHAIN
    // =========================

    @Bean
    public SecurityFilterChain securityFilterChain(

            HttpSecurity http

    ) throws Exception {

        http

                // =========================
                // DISABLE CSRF
                // =========================

                .csrf(csrf -> csrf.disable())

                // =========================
                // ENABLE CORS
                // =========================

                .cors(cors ->

                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // =========================
                // STATELESS SESSION
                // =========================

                .sessionManagement(session ->

                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // =========================
                // EXCEPTION HANDLER
                // =========================

                .exceptionHandling(exception ->

                        exception.authenticationEntryPoint(
                                jwtAuthenticationEntryPoint
                        )
                )

                // =========================
                // REQUEST AUTHORIZATION
                // =========================

                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // PUBLIC APIs
                        // =========================

                        .requestMatchers(

                                "/api/auth/**",

                                "/error"

                        ).permitAll()

                        // =========================
                        // SWAGGER APIs
                        // =========================

                        .requestMatchers(

                                "/swagger-ui/**",

                                "/v3/api-docs/**"

                        ).permitAll()

                        // =========================
                        // ADMIN APIs
                        // =========================

                        .requestMatchers(

                                "/api/admin/**"

                        ).hasAuthority(
                                "ROLE_ADMIN"
                        )

                        // =========================
                        // USER APIs
                        // =========================

                        .requestMatchers(

                                "/api/dashboard/**",

                                "/api/scan/**"

                        ).hasAnyAuthority(

                                "ROLE_USER",

                                "ROLE_ADMIN"
                        )

                        // =========================
                        // ALL OTHER REQUESTS
                        // =========================

                        .anyRequest()
                        .authenticated()
                )

                // =========================
                // ADD JWT FILTER
                // =========================

                .addFilterBefore(

                        jwtAuthenticationFilter,

                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // =========================
    // CORS CONFIGURATION
    // =========================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =

                new CorsConfiguration();

        // =========================
        // ALLOWED ORIGINS
        // =========================

        configuration.setAllowedOrigins(

                List.of(

                        "http://localhost:3000"
                )
        );

        // =========================
        // ALLOWED METHODS
        // =========================

        configuration.setAllowedMethods(

                List.of(

                        "GET",

                        "POST",

                        "PUT",

                        "DELETE",

                        "OPTIONS"
                )
        );

        // =========================
        // ALLOWED HEADERS
        // =========================

        configuration.setAllowedHeaders(

                List.of("*")
        );

        // =========================
        // EXPOSE HEADERS
        // =========================

        configuration.setExposedHeaders(

                List.of(

                        "Authorization"
                )
        );

        // =========================
        // ALLOW CREDENTIALS
        // =========================

        configuration.setAllowCredentials(
                true
        );

        // =========================
        // CACHE PREFLIGHT
        // =========================

        configuration.setMaxAge(
                3600L
        );

        // =========================
        // REGISTER CONFIG
        // =========================

        UrlBasedCorsConfigurationSource source =

                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(

                "/**",

                configuration
        );

        return source;
    }
}