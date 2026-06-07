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
@Document(collection = "attachments")
public class Attachment {
    @Id
    private String id;
    private String uploadedBy;
    private String chatType;
    private String receiverEmail;
    private String roomId;
    private String fileName;
    private String fileType;
    private String fileUrl;
    private Long fileSize;
    private LocalDateTime uploadedAt;
}
