package com.phishing.backend.service;

import com.phishing.backend.dto.AuthRequest;
import com.phishing.backend.dto.RegisterRequest;
import com.phishing.backend.entity.User;
import com.phishing.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // Password Encoder

    private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();

    // =========================
    // REGISTER USER
    // =========================

    public String register(
            RegisterRequest request
    ) {

        // Check Existing Email

        Optional<User> existingUser =
                userRepository.findByEmail(
                        request.getEmail()
                );

        if (existingUser.isPresent()) {

            throw new RuntimeException(
                    "Email Already Exists"
            );
        }

        // Create New User

        User user = User.builder()

                .name(request.getName())

                .email(request.getEmail())

                .password(
                        encoder.encode(
                                request.getPassword()
                        )
                )

                .role("USER")

                .active(true)

                .build();

        // Save User

        userRepository.save(user);

        return "User Registered Successfully";
    }

    // =========================
    // LOGIN USER
    // =========================

    public String login(
            AuthRequest request
    ) {

        // Find User By Email

        User user = userRepository

                .findByEmail(request.getEmail())

                .orElseThrow(() ->
                        new RuntimeException(
                                "User Not Found"
                        )
                );

        // Check Password

        boolean match = encoder.matches(

                request.getPassword(),

                user.getPassword()
        );

        if (!match) {

            throw new RuntimeException(
                    "Invalid Password"
            );
        }

        // Check Account Status

        if (!user.isActive()) {

            throw new RuntimeException(
                    "Account Disabled"
            );
        }

        return "Login Success";
    }

    // =========================
    // GET USER BY EMAIL
    // =========================

    public User getUserByEmail(
            String email
    ) {

        return userRepository

                .findByEmail(email)

                .orElseThrow(() ->
                        new RuntimeException(
                                "User Not Found"
                        )
                );
    }

    // =========================
    // DELETE USER
    // =========================

    public String deleteUser(
            Long id
    ) {

        userRepository.deleteById(id);

        return "User Deleted Successfully";
    }
}