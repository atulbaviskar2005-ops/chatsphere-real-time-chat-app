package com.chatapp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private String senderEmail;
    private String receiverEmail;
    private String roomId;
    private String content;
    private MessageType messageType;
    private String fileUrl;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private MessageStatus status;
    private String replyToMessageId;
    private boolean edited;
    private boolean deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime seenAt;

    public enum MessageType {
        TEXT, IMAGE, VIDEO, AUDIO, PDF, DOCUMENT
    }

    public enum MessageStatus {
        SENT, DELIVERED, SEEN
    }
}
