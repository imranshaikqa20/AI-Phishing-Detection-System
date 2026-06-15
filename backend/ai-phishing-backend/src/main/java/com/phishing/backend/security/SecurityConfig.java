package com.phishing.backend.security;

import com.phishing.backend.jwt.JwtAuthenticationEntryPoint;
import com.phishing.backend.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // =========================================
    // FRONTEND URL FROM ENVIRONMENT
    // =========================================

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    // =========================================
    // JWT FILTER
    // =========================================

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // =========================================
    // AUTH ENTRY POINT
    // =========================================

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    // =========================================
    // PASSWORD ENCODER
    // =========================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =========================================
    // AUTHENTICATION MANAGER
    // =========================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // =========================================
    // SECURITY FILTER CHAIN
    // =========================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(
                                jwtAuthenticationEntryPoint
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/api/auth/**",
                                "/api/public/**",
                                "/error"
                        ).permitAll()

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        .requestMatchers(
                                "/actuator/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/payment/webhook"
                        ).permitAll()

                        .requestMatchers(
                                "/api/admin/**"
                        ).hasAuthority("ROLE_ADMIN")

                        .requestMatchers(
                                "/api/dashboard/**",
                                "/api/scan/**",
                                "/api/payment/**",
                                "/api/profile/**"
                        ).hasAnyAuthority(
                                "ROLE_USER",
                                "ROLE_ADMIN"
                        )

                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // =========================================
    // CORS CONFIGURATION
    // =========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        // =========================================
        // ALLOWED ORIGINS
        // =========================================

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:3000",
                        "http://127.0.0.1:3000",
                        frontendUrl
                )
        );

        // =========================================
        // ALLOWED METHODS
        // =========================================

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        // =========================================
        // ALLOWED HEADERS
        // =========================================

        configuration.setAllowedHeaders(
                List.of("*")
        );

        // =========================================
        // EXPOSE HEADERS
        // =========================================

        configuration.setExposedHeaders(
                List.of("Authorization")
        );

        // =========================================
        // ALLOW CREDENTIALS
        // =========================================

        configuration.setAllowCredentials(true);

        // =========================================
        // PREFLIGHT CACHE
        // =========================================

        configuration.setMaxAge(3600L);

        // =========================================
        // REGISTER CONFIG
        // =========================================

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}