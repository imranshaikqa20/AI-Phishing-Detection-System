package com.phishing.backend.controller;

import com.phishing.backend.service.UrlScannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/url")
@CrossOrigin("*")
public class UrlScannerController {

    @Autowired
    private UrlScannerService urlScannerService;

    @PostMapping("/scan")
    public String scanUrl(@RequestBody String url) {
        return urlScannerService.scanUrl(url);
    }
}