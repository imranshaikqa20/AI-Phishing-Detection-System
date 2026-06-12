 package com.phishing.backend.service;

import org.springframework.stereotype.Service;

@Service
public class EmailScannerService {

    public String scanEmail(String emailText) {

        int risk = 0;

        String[] suspiciousWords = {
                "urgent",
                "verify your account",
                "bank",
                "credit card",
                "click here",
                "password",
                "otp",
                "winner"
        };

        for(String word : suspiciousWords) {
            if(emailText.toLowerCase().contains(word)) {
                risk += 15;
            }
        }

        if(risk >= 45) {
            return "PHISHING EMAIL DETECTED";
        }

        return "SAFE EMAIL";
    }
}