package com.chatapp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "chatRooms")
public class ChatRoom {
    @Id
    private String id;
    private String name;
    private String description;
    private String groupImage;
    private String createdBy;
    @Builder.Default
    private Set<String> admins = new HashSet<>();
    @Builder.Default
    private Set<String> members = new HashSet<>();
    @Builder.Default
    private List<String> pinnedMessageIds = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
