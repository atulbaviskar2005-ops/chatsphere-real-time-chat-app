package com.chatapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    @Indexed(unique = true)
    private String email;
    @JsonIgnore
    private String password;
    private String profileImage;
    private String bio;
    private PresenceStatus status;
    private LocalDateTime lastSeen;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @Builder.Default
    private Set<String> mutedRoomIds = new HashSet<>();
    @Builder.Default
    private boolean desktopNotifications = true;
    @Builder.Default
    private boolean soundNotifications = true;
    @Builder.Default
    private boolean privateLastSeen = false;

    public enum PresenceStatus {
        ONLINE, OFFLINE, AWAY, RECORDING
    }
}
