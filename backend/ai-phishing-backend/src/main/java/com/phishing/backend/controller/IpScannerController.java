package com.phishing.backend.controller;

import com.phishing.backend.service.IpScannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ip")
@CrossOrigin("*")
public class IpScannerController {

    @Autowired
    private IpScannerService ipScannerService;

    @PostMapping("/scan")
    public String scanIp(@RequestBody String ip) {
        return ipScannerService.scanIp(ip);
    }
}