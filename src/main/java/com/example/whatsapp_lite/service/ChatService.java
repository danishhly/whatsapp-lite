package com.example.whatsapp_lite.service;

import com.example.whatsapp_lite.dto.MessagePayload;
import com.example.whatsapp_lite.model.ChatMessage;
import com.example.whatsapp_lite.repo.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ChatService {
    @Autowired
    private ChatMessageRepository messageRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ChatMessage handleIncomingMessage(MessagePayload payload) {
        // Create chatId canonical order to group by conversation
        String chatId = canonicalChatId(payload.getSenderId(), payload.getReceiverId());

        ChatMessage msg = new ChatMessage();
        msg.setChatId(chatId);
        msg.setSenderId(payload.getSenderId());
        msg.setReceiverId(payload.getReceiverId());
        msg.setContent(payload.getContent());
        msg.setTimestamp(Instant.now());
        msg.setStatus(ChatMessage.MessageStatus.SENT);

        //persist
        ChatMessage saved = messageRepository.save(msg);

        //publish to Redis channel for receiver (fan-out across instances)
        String channel = "user:" + payload.getReceiverId() + ":channel";
        redisTemplate.convertAndSend(channel, saved);
        // Also push locally using SimpMessagingTemplate (if the receiver is connected to this instance)
        // user destination: /user/{receiverId}/queue/messages
        messagingTemplate.convertAndSendToUser(payload.getReceiverId(), "/queue/messages", saved);
        return saved;
    }

    public ChatMessage markDelivered(String messageId) {
        ChatMessage msg = messageRepository.findById(messageId).orElse(null);
        if(msg != null) {
            msg.setStatus(ChatMessage.MessageStatus.DELIVERED);
            messageRepository.save(msg);
        }
        return msg;
    }

    public ChatMessage markSeen(String messageId) {
        ChatMessage msg = messageRepository.findById(messageId).orElse(null);
        if(msg != null) {
            msg.setStatus(ChatMessage.MessageStatus.SEEN);
            messageRepository.save(msg);
        }
        return msg;
    }

    public java.util.List<ChatMessage> fetchHistory(String userA, String userB) {
        return messageRepository.findTop100ByChatIdOrderByTimestampDesc(canonicalChatId(userA, userB));
    }

    private String canonicalChatId(String a , String b) {
        if (a.compareTo(b) <= 0) return a + "_" + b;
        else return b + "_" + a;
    }
}
