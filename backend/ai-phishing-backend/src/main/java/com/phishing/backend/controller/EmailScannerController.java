package com.phishing.backend.controller;

import com.phishing.backend.service.EmailScannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin("*")
public class EmailScannerController {

    @Autowired
    private EmailScannerService emailScannerService;

    @PostMapping("/scan")
    public String scanEmail(@RequestBody String email) {
        return emailScannerService.scanEmail(email);
    }
}