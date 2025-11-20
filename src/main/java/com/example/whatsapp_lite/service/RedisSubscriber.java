package com.example.whatsapp_lite.service;

import com.example.whatsapp_lite.model.ChatMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
public class RedisSubscriber implements MessageListener {

    @Autowired
    private RedisMessageListenerContainer container;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private ObjectMapper mapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        // We could dynamically subscribe to patterns. for demo, subscribe to pattern user:*:channel
        container.addMessageListener(this, new org.springframework.data.redis.listener.PatternTopic("user:*:channel"));
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String payload = new String(message.getBody(), StandardCharsets.UTF_8);
            // payload will be JSON-serialized ChatMessage (from RedisTemplate.convertAndSend)
            ChatMessage msg = mapper.readValue(payload, ChatMessage.class);
            // deliver to user via STOMP user destination
            messagingTemplate.convertAndSendToUser(msg.getReceiverId(), "/queue/messages", msg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
