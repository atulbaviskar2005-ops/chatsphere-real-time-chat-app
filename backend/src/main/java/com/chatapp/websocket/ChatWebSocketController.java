package com.chatapp.websocket;

import com.chatapp.dto.MessageRequest;
import com.chatapp.dto.SocketEvent;
import com.chatapp.model.Message;
import com.chatapp.model.User;
import com.chatapp.service.ChatService;
import com.chatapp.service.NotificationService;
import com.chatapp.service.RoomService;
import com.chatapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {
    private final SimpMessagingTemplate template;
    private final ChatService chat;
    private final UserService users;
    private final NotificationService notifications;
    private final RoomService rooms;

    @MessageMapping("/chat.private")
    public void privateMessage(MessageRequest request, Principal principal) {
        Message saved = chat.save(request, principal.getName());
        template.convertAndSendToUser(saved.getReceiverEmail(), "/queue/messages", saved);
        template.convertAndSendToUser(saved.getSenderEmail(), "/queue/messages", saved);
        if (saved.getReceiverEmail() != null && !saved.getReceiverEmail().equals(saved.getSenderEmail())) {
            var notification = notifications.create(
                    saved.getReceiverEmail(),
                    saved.getSenderEmail(),
                    "New message",
                    saved.getContent() == null || saved.getContent().isBlank() ? "Sent an attachment" : saved.getContent(),
                    "PRIVATE_MESSAGE",
                    saved.getSenderEmail()
            );
            template.convertAndSendToUser(saved.getReceiverEmail(), "/queue/notifications", notification);
        }
    }

    @MessageMapping("/chat.group")
    public void groupMessage(MessageRequest request, Principal principal) {
        Message saved = chat.save(request, principal.getName());
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
    }

    @MessageMapping("/chat.typing")
    public void typing(SocketEvent event, Principal principal) {
        event.setSenderEmail(principal.getName());
        if (event.getReceiverEmail() != null) {
            template.convertAndSendToUser(event.getReceiverEmail(), "/queue/typing", event);
        }
        if (event.getChatId() != null) {
            template.convertAndSend("/topic/typing/" + event.getChatId(), event);
        }
    }

    @MessageMapping("/chat.delivered")
    public void delivered(SocketEvent event) {
        Message message = chat.markDelivered(event.getMessageId());
        template.convertAndSendToUser(message.getSenderEmail(), "/queue/messages", message);
    }

    @MessageMapping("/chat.seen")
    public void seen(SocketEvent event) {
        Message message = chat.markSeen(event.getMessageId());
        template.convertAndSendToUser(message.getSenderEmail(), "/queue/messages", message);
    }

    @MessageMapping("/user.online")
    public void online(Principal principal) {
        template.convertAndSend("/topic/status", users.presence(principal.getName(), User.PresenceStatus.ONLINE));
    }

    @MessageMapping("/user.offline")
    public void offline(Principal principal) {
        template.convertAndSend("/topic/status", users.presence(principal.getName(), User.PresenceStatus.OFFLINE));
    }
}
