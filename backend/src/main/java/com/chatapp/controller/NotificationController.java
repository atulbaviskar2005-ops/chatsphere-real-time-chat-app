package com.chatapp.controller;

import com.chatapp.model.Notification;
import com.chatapp.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notifications;

    @GetMapping
    public List<Notification> all(Authentication authentication) {
        return notifications.all(authentication.getName());
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unread(Authentication authentication) {
        return Map.of("count", notifications.unreadCount(authentication.getName()));
    }

    @PutMapping("/read-all")
    public Map<String, String> readAll(Authentication authentication) {
        notifications.markAllRead(authentication.getName());
        return Map.of("message", "Notifications marked as read");
    }
}
