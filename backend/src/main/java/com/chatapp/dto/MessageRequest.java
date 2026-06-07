package com.chatapp.dto;

import com.chatapp.model.Message;
import lombok.Data;

@Data
public class MessageRequest {
    private String senderEmail;
    private String receiverEmail;
    private String roomId;
    private String content;
    private Message.MessageType messageType = Message.MessageType.TEXT;
    private String fileUrl;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String replyToMessageId;
}
