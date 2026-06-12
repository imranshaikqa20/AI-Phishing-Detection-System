package com.phishing.backend.security;

import com.phishing.backend.jwt.JwtAuthenticationEntryPoint;
import com.phishing.backend.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
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

                // =========================================
                // DISABLE CSRF
                // =========================================

                .csrf(csrf -> csrf.disable())

                // =========================================
                // ENABLE CORS
                // =========================================

                .cors(cors ->

                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // =========================================
                // STATELESS SESSION
                // =========================================

                .sessionManagement(session ->

                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // =========================================
                // JWT EXCEPTION HANDLER
                // =========================================

                .exceptionHandling(exception ->

                        exception.authenticationEntryPoint(
                                jwtAuthenticationEntryPoint
                        )
                )

                // =========================================
                // AUTHORIZATION RULES
                // =========================================

                .authorizeHttpRequests(auth -> auth

                        // =========================================
                        // PUBLIC APIs
                        // =========================================

                        .requestMatchers(

                                "/api/auth/**",

                                "/api/public/**",

                                "/error"

                        ).permitAll()

                        // =========================================
                        // SWAGGER / API DOCS
                        // =========================================

                        .requestMatchers(

                                "/swagger-ui/**",

                                "/swagger-ui.html",

                                "/v3/api-docs/**"

                        ).permitAll()

                        // =========================================
                        // ACTUATOR
                        // =========================================

                        .requestMatchers(

                                "/actuator/**"

                        ).permitAll()

                        // =========================================
                        // STRIPE WEBHOOK
                        // =========================================

                        .requestMatchers(

                                "/api/payment/webhook"

                        ).permitAll()

                        // =========================================
                        // ADMIN APIs
                        // =========================================

                        .requestMatchers(

                                "/api/admin/**"

                        ).hasAuthority(
                                "ROLE_ADMIN"
                        )

                        // =========================================
                        // USER APIs
                        // =========================================

                        .requestMatchers(

                                "/api/dashboard/**",

                                "/api/scan/**",

                                "/api/payment/**",

                                "/api/profile/**"

                        ).hasAnyAuthority(

                                "ROLE_USER",

                                "ROLE_ADMIN"
                        )

                        // =========================================
                        // ALL OTHER REQUESTS
                        // =========================================

                        .anyRequest()
                        .authenticated()
                )

                // =========================================
                // JWT FILTER
                // =========================================

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

                        "http://127.0.0.1:3000"
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

                List.of(

                        "Authorization"
                )
        );

        // =========================================
        // ALLOW CREDENTIALS
        // =========================================

        configuration.setAllowCredentials(
                true
        );

        // =========================================
        // PREFLIGHT CACHE
        // =========================================

        configuration.setMaxAge(
                3600L
        );

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