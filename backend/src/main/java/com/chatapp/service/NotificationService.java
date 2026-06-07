package com.chatapp.service;

import com.chatapp.model.Notification;
import com.chatapp.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notifications;

    public Notification create(String userEmail, String actorEmail, String title, String message, String type, String linkId) {
        Notification notification = Notification.builder()
                .userEmail(userEmail)
                .actorEmail(actorEmail)
                .title(title)
                .message(message)
                .type(type)
                .linkId(linkId)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
        return notifications.save(notification);
    }

    public List<Notification> all(String email) {
        return notifications.findByUserEmailOrderByCreatedAtDesc(email);
    }

    public long unreadCount(String email) {
        return notifications.countByUserEmailAndReadFalse(email);
    }

    public void markAllRead(String email) {
        List<Notification> items = notifications.findByUserEmailOrderByCreatedAtDesc(email);
        items.forEach(item -> item.setRead(true));
        notifications.saveAll(items);
    }
}
