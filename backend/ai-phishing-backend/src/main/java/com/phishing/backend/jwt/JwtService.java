package com.phishing.backend.jwt;

import com.phishing.backend.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;

import java.security.Key;

import java.util.Date;

import java.util.HashMap;
import java.util.Map;

import java.util.function.Function;

@Service
public class JwtService {

    // =========================
    // SECRET KEY
    // =========================

    @Value("${jwt.secret}")

    private String secret;

    // =========================
    // TOKEN EXPIRATION
    // =========================

    @Value("${jwt.expiration}")

    private long jwtExpiration;

    // =========================
    // GENERATE SECRET KEY
    // =========================

    private Key getSigningKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes()
        );
    }

    // =========================
    // GENERATE TOKEN
    // =========================

    public String generateToken(
            User user
    ) {

        Map<String, Object> claims =
                new HashMap<>();

        claims.put(
                "role",
                user.getRole()
        );

        claims.put(
                "name",
                user.getName()
        );

        return Jwts.builder()

                .setClaims(claims)

                .setSubject(
                        user.getEmail()
                )

                .setIssuedAt(
                        new Date(
                                System.currentTimeMillis()
                        )
                )

                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtExpiration
                        )
                )

                .signWith(
                        getSigningKey(),
                        SignatureAlgorithm.HS256
                )

                .compact();
    }

    // =========================
    // EXTRACT EMAIL
    // =========================

    public String extractUsername(
            String token
    ) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }

    // =========================
    // EXTRACT ROLE
    // =========================

    public String extractRole(
            String token
    ) {

        Claims claims =
                extractAllClaims(token);

        return claims.get(
                "role",
                String.class
        );
    }

    // =========================
    // EXTRACT CLAIM
    // =========================

    public <T> T extractClaim(

            String token,

            Function<Claims, T>
                    claimsResolver
    ) {

        final Claims claims =
                extractAllClaims(token);

        return claimsResolver.apply(
                claims
        );
    }

    // =========================
    // EXTRACT ALL CLAIMS
    // =========================

    private Claims extractAllClaims(
            String token
    ) {

        return Jwts.parserBuilder()

                .setSigningKey(
                        getSigningKey()
                )

                .build()

                .parseClaimsJws(token)

                .getBody();
    }

    // =========================
    // VALIDATE TOKEN
    // =========================

    public boolean isTokenValid(
            String token,
            String email
    ) {

        final String username =
                extractUsername(token);

        return (

                username.equals(email)

                        &&

                        !isTokenExpired(token)
        );
    }

    // =========================
    // CHECK TOKEN EXPIRATION
    // =========================

    private boolean isTokenExpired(
            String token
    ) {

        return extractExpiration(token)

                .before(new Date());
    }

    // =========================
    // EXTRACT EXPIRATION
    // =========================

    private Date extractExpiration(
            String token
    ) {

        return extractClaim(
                token,
                Claims::getExpiration
        );
    }
}