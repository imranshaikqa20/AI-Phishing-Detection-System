
package com.phishing.backend.service;

import org.springframework.stereotype.Service;

@Service
public class IpScannerService {

    public String scanIp(String ip) {

        String[] blacklistedIps = {
                "123.45.67.89",
                "45.67.89.10"
        };

        for(String badIp : blacklistedIps) {
            if(ip.equals(badIp)) {
                return "MALICIOUS IP DETECTED";
            }
        }

        return "SAFE IP";
    }
}