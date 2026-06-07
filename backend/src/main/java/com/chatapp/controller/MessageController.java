package com.chatapp.controller;

import com.chatapp.dto.MessageRequest;
import com.chatapp.dto.MessageUpdateRequest;
import com.chatapp.model.Message;
import com.chatapp.service.ChatService;
import com.chatapp.service.NotificationService;
import com.chatapp.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final ChatService chat;
    private final SimpMessagingTemplate template;
    private final NotificationService notifications;
    private final RoomService rooms;

    @GetMapping("/private/{userId}")
    public List<Message> privateHistory(Authentication authentication, @PathVariable String userId) {
        return chat.privateHistory(authentication.getName(), userId);
    }

    @GetMapping("/room/{roomId}")
    public List<Message> roomHistory(@PathVariable String roomId) {
        return chat.roomHistory(roomId);
    }

    @PostMapping("/private/{userId}")
    public Message sendPrivate(Authentication authentication, @PathVariable String userId, @RequestBody MessageRequest request) {
        request.setReceiverEmail(userId);
        Message saved = chat.save(request, authentication.getName());
        template.convertAndSendToUser(saved.getReceiverEmail(), "/queue/messages", saved);
        template.convertAndSendToUser(saved.getSenderEmail(), "/queue/messages", saved);
        var notification = notifications.create(
                saved.getReceiverEmail(),
                saved.getSenderEmail(),
                "New message",
                saved.getContent() == null || saved.getContent().isBlank() ? "Sent an attachment" : saved.getContent(),
                "PRIVATE_MESSAGE",
                saved.getSenderEmail()
        );
        template.convertAndSendToUser(saved.getReceiverEmail(), "/queue/notifications", notification);
        return saved;
    }

    @PostMapping("/room/{roomId}")
    public Message sendRoom(Authentication authentication, @PathVariable String roomId, @RequestBody MessageRequest request) {
        request.setRoomId(roomId);
        Message saved = chat.save(request, authentication.getName());
        template.convertAndSend("/topic/group/" + saved.getRoomId(), saved);
        rooms.get(saved.getRoomId()).getMembers().stream()
                .filter(member -> !member.equals(saved.getSenderEmail()))
                .forEach(member -> {
                    var notification = notifications.create(
                            member,
                            saved.getSenderEmail(),
                            "New group message",
                            saved.getContent() == null || saved.getContent().isBlank() ? "Sent an attachment" : saved.getContent(),
                            "GROUP_MESSAGE",
                            saved.getRoomId()
                    );
                    template.convertAndSendToUser(member, "/queue/notifications", notification);
                });
        return saved;
    }

    @PutMapping("/{messageId}")
    public Message edit(Authentication authentication, @PathVariable String messageId, @RequestBody MessageUpdateRequest request) {
        return chat.edit(messageId, request, authentication.getName());
    }

    @DeleteMapping("/{messageId}")
    public Message delete(Authentication authentication, @PathVariable String messageId) {
        return chat.delete(messageId, authentication.getName());
    }

    @GetMapping("/search")
    public List<Message> search(@RequestParam String keyword) {
        return chat.search(keyword);
    }
}
