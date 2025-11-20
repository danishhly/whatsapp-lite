package com.example.whatsapp_lite.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessagePayload {
    private String senderId;
    private String receiverId;
    private String content;
    private String clientMessageId;
}
