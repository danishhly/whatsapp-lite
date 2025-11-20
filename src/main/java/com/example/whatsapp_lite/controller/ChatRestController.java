package com.example.whatsapp_lite.controller;

import com.example.whatsapp_lite.model.ChatMessage;
import com.example.whatsapp_lite.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/chat")
public class ChatRestController {
    @Autowired
    private ChatService chatService;

    @GetMapping("/history")
    public List<ChatMessage> history(@RequestParam String a, @RequestParam String b) {
        return chatService.fetchHistory(a, b);
    }

    //fallback send when websocket not available
    @PostMapping("/send")
    public ChatMessage sendFallback(@RequestBody com.example.whatsapp_lite.dto.MessagePayload payload) {
        return chatService.handleIncomingMessage(payload);
    }
}
