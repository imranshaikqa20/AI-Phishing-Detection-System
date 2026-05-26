package com.phishing.backend.service;

import com.phishing.backend.dto.AuthRequest;
import com.phishing.backend.dto.AuthResponse;
import com.phishing.backend.dto.RegisterRequest;

import com.phishing.backend.entity.User;

import com.phishing.backend.jwt.JwtService;

import com.phishing.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // =========================
    // JWT SERVICE
    // =========================

    @Autowired
    private JwtService jwtService;

    // =========================
    // PASSWORD ENCODER
    // =========================

    private final BCryptPasswordEncoder
            encoder =
            new BCryptPasswordEncoder();

    // =========================
    // REGISTER USER
    // =========================

    public String register(
            RegisterRequest request
    ) {

        // =========================
        // CHECK EXISTING EMAIL
        // =========================

        Optional<User> existingUser =

                userRepository.findByEmail(

                        request.getEmail()
                                .toLowerCase()
                );

        if (existingUser.isPresent()) {

            throw new RuntimeException(
                    "Email Already Exists"
            );
        }

        // =========================
        // ROLE VALIDATION
        // =========================

        String role = request.getRole();

        if (
                role == null ||
                        role.isEmpty()
        ) {

            role = "ROLE_USER";
        }

        // Allow Only USER / ADMIN

        if (

                !role.equals("ROLE_USER")

                        &&

                        !role.equals("ROLE_ADMIN")
        ) {

            role = "ROLE_USER";
        }

        // =========================
        // CREATE USER
        // =========================

        User user = User.builder()

                .name(
                        request.getName()
                )

                .email(
                        request.getEmail()
                                .toLowerCase()
                )

                .password(

                        encoder.encode(
                                request.getPassword()
                        )
                )

                .role(role)

                .active(true)

                .loginCount(0)

                .createdAt(
                        LocalDateTime.now()
                )

                .updatedAt(
                        LocalDateTime.now()
                )

                .build();

        // =========================
        // SAVE USER
        // =========================

        userRepository.save(user);

        return "User Registered Successfully";
    }

    // =========================
    // LOGIN USER
    // =========================

    public AuthResponse login(
            AuthRequest request
    ) {

        // =========================
        // FIND USER
        // =========================

        User user = userRepository

                .findByEmail(

                        request.getEmail()
                                .toLowerCase()
                )

                .orElseThrow(() ->

                        new RuntimeException(
                                "User Not Found"
                        )
                );

        // =========================
        // CHECK PASSWORD
        // =========================

        boolean match = encoder.matches(

                request.getPassword(),

                user.getPassword()
        );

        if (!match) {

            throw new RuntimeException(
                    "Invalid Password"
            );
        }

        // =========================
        // CHECK ACCOUNT STATUS
        // =========================

        if (!user.isActive()) {

            throw new RuntimeException(
                    "Account Disabled"
            );
        }

        // =========================
        // UPDATE LOGIN DETAILS
        // =========================

        user.setLoginCount(

                user.getLoginCount() + 1
        );

        user.setLastLoginAt(
                LocalDateTime.now()
        );

        user.setUpdatedAt(
                LocalDateTime.now()
        );

        // Save Updated User

        userRepository.save(user);

        // =========================
        // GENERATE JWT TOKEN
        // =========================

        String jwtToken =

                jwtService.generateToken(
                        user
                );

        // =========================
        // RETURN RESPONSE
        // =========================

        return AuthResponse.builder()

                .message(
                        "Login Successful"
                )

                // REAL JWT TOKEN

                .token(jwtToken)

                .role(
                        user.getRole()
                )

                .name(
                        user.getName()
                )

                .email(
                        user.getEmail()
                )

                .active(
                        user.isActive()
                )

                .loginCount(
                        user.getLoginCount()
                )

                .lastLoginAt(

                        user.getLastLoginAt() != null

                                ?

                                user.getLastLoginAt()
                                        .toString()

                                :

                                null
                )

                .build();
    }

    // =========================
    // GET USER BY EMAIL
    // =========================

    public User getUserByEmail(
            String email
    ) {

        return userRepository

                .findByEmail(
                        email.toLowerCase()
                )

                .orElseThrow(() ->

                        new RuntimeException(
                                "User Not Found"
                        )
                );
    }

    // =========================
    // GET ALL USERS
    // ADMIN FEATURE
    // =========================

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    // =========================
    // DISABLE USER
    // =========================

    public String disableUser(
            Long id
    ) {

        User user = userRepository

                .findById(id)

                .orElseThrow(() ->

                        new RuntimeException(
                                "User Not Found"
                        )
                );

        user.setActive(false);

        user.setUpdatedAt(
                LocalDateTime.now()
        );

        userRepository.save(user);

        return "User Disabled Successfully";
    }

    // =========================
    // ENABLE USER
    // =========================

    public String enableUser(
            Long id
    ) {

        User user = userRepository

                .findById(id)

                .orElseThrow(() ->

                        new RuntimeException(
                                "User Not Found"
                        )
                );

        user.setActive(true);

        user.setUpdatedAt(
                LocalDateTime.now()
        );

        userRepository.save(user);

        return "User Enabled Successfully";
    }

    // =========================
    // DELETE USER
    // =========================

    public String deleteUser(
            Long id
    ) {

        User user = userRepository

                .findById(id)

                .orElseThrow(() ->

                        new RuntimeException(
                                "User Not Found"
                        )
                );

        userRepository.delete(user);

        return "User Deleted Successfully";
    }
}