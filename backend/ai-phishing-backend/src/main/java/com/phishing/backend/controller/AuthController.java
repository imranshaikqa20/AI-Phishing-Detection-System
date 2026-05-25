package com.phishing.backend.controller;

import com.phishing.backend.dto.AuthRequest;
import com.phishing.backend.dto.RegisterRequest;
import com.phishing.backend.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Register API

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request
    ) {

        try {

            String response =
                    authService.register(request);

            Map<String, Object> result =
                    new HashMap<>();

            result.put("success", true);
            result.put("message", response);

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            Map<String, Object> error =
                    new HashMap<>();

            error.put("success", false);
            error.put("message",
                    "Registration Failed");

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error);
        }
    }

    // Login API

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody AuthRequest request
    ) {

        try {

            String response =
                    authService.login(request);

            Map<String, Object> result =
                    new HashMap<>();

            result.put("success", true);
            result.put("message", response);

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            Map<String, Object> error =
                    new HashMap<>();

            error.put("success", false);
            error.put("message",
                    "Invalid Email or Password");

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(error);
        }
    }
}