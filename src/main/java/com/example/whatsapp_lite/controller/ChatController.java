package com.example.whatsapp_lite.controller;

import com.example.whatsapp_lite.dto.MessagePayload;
import com.example.whatsapp_lite.model.ChatMessage;
import com.example.whatsapp_lite.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private ChatService chatService;

    //client sends to /app/chat.send
    @MessageMapping("/chat.send")
    @SendToUser("/queue/ack") //optional send ack back to sender
    public ChatMessage send(MessagePayload payload, @Header("simpSessionId") String sessionId) {
        // persist and publish
        ChatMessage saved = chatService.handleIncomingMessage(payload);
        return saved;
    }
    // clients can notify delivered/seen via specific endpoints or REST
    @MessageMapping("/chat.delivered")
    public void delivered(String messageId) {
        chatService.markDelivered(messageId);
        }

        @MessageMapping("/chat.seen")
    public void seen(String messageId) {
        chatService.markSeen(messageId);
        }
}
