package com.example.whatsapp_lite.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "message")
@CompoundIndexes({
        @CompoundIndex(name = "chat_time_idx", def = "{'chatId': 1, 'timestamp': 1}")
})
public class ChatMessage {
    @Id
    private String id;
    private String chatId;
    private String senderId;
    private String receiverId;
    private String content;
    private Instant timestamp;
    private MessageStatus status;

    public enum MessageStatus {
        SENT, DELIVERED, SEEN
    }
}
