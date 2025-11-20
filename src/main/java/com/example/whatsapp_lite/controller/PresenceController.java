package com.example.whatsapp_lite.controller;


import com.example.whatsapp_lite.service.PresenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/presence")
public class PresenceController {

    @Autowired
    private PresenceService presenceService;

    @PostMapping("/heartbeat/{userId}")
    public void heartbeat(@PathVariable String userId) {
        presenceService.heartbeat(userId);
    }

    @GetMapping("/status/{userId}")
    public boolean status(@PathVariable String userId) {
        return presenceService.isOnline(userId);
    }
}
