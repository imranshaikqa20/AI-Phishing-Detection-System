
package com.phishing.backend.service;

import org.springframework.stereotype.Service;

@Service
public class UrlScannerService {

    public String scanUrl(String url) {

        int risk = 0;

        // HTTP check
        if(url.startsWith("http://")) {
            risk += 30;
        }

        // Suspicious keywords
        String[] keywords = {
                "login",
                "verify",
                "bank",
                "secure",
                "update",
                "password",
                "free"
        };

        for(String word : keywords) {
            if(url.toLowerCase().contains(word)) {
                risk += 10;
            }
        }

        // Long URL check
        if(url.length() > 75) {
            risk += 20;
        }

        // IP inside URL
        if(url.matches(".*\\d+\\.\\d+\\.\\d+\\.\\d+.*")) {
            risk += 40;
        }

        if(risk >= 60) {
            return "PHISHING URL DETECTED";
        }

        return "SAFE URL";
    }
}