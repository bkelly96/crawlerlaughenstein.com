package com.crawlerlaughenstein.api.dashboard;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @GetMapping("/dm")
    public Map<String, String> dmDashboard() {
        return Map.of("message", "DM dashboard stub");
    }

    @GetMapping("/player")
    public Map<String, String> playerDashboard() {
        return Map.of("message", "Player dashboard stub");
    }
}
