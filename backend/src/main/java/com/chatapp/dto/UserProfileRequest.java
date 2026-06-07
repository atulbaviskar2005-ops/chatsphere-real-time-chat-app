package com.chatapp.dto;

import lombok.Data;

@Data
public class UserProfileRequest {
    private String name;
    private String bio;
    private String profileImage;
    private Boolean desktopNotifications;
    private Boolean soundNotifications;
    private Boolean privateLastSeen;
}
