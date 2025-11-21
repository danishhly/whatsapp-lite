package com.example.whatsapp_lite.repo;

import com.example.whatsapp_lite.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findTop100ByChatIdOrderByTimestampDesc(String chatId);
}
