package com.example.whatsapp_lite.dto;


import lombok.Data;

@Data
public class MessagePayload {
    private String senderId;
    private String receiverId;
    private String content;
    private String clientMessageId;
}
