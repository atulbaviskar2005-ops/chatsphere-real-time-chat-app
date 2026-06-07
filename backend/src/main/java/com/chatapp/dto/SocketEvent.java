package com.chatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocketEvent {
    private String type;
    private String chatId;
    private String senderEmail;
    private String receiverEmail;
    private String roomId;
    private String messageId;
    private Object payload;
}
