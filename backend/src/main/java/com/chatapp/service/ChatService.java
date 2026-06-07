package com.chatapp.service;

import com.chatapp.dto.MessageRequest;
import com.chatapp.dto.MessageUpdateRequest;
import com.chatapp.exception.ApiException;
import com.chatapp.model.Message;
import com.chatapp.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final MessageRepository messages;

    public Message save(MessageRequest request, String fallbackSender) {
        String sender = request.getSenderEmail() == null ? fallbackSender : request.getSenderEmail();
        LocalDateTime now = LocalDateTime.now();
        Message message = Message.builder()
                .senderEmail(sender)
                .receiverEmail(request.getReceiverEmail())
                .roomId(request.getRoomId())
                .content(request.getContent())
                .messageType(request.getMessageType() == null ? Message.MessageType.TEXT : request.getMessageType())
                .fileUrl(request.getFileUrl())
                .fileName(request.getFileName())
                .fileType(request.getFileType())
                .fileSize(request.getFileSize())
                .replyToMessageId(request.getReplyToMessageId())
                .status(Message.MessageStatus.SENT)
                .createdAt(now)
                .updatedAt(now)
                .build();
        return messages.save(message);
    }

    public Message save(MessageRequest request) {
        return save(request, request.getSenderEmail());
    }

    public List<Message> privateHistory(String me, String other) {
        return messages.findBySenderEmailAndReceiverEmailOrSenderEmailAndReceiverEmailOrderByCreatedAtAsc(me, other, other, me);
    }

    public List<Message> roomHistory(String roomId) {
        return messages.findByRoomIdOrderByCreatedAtAsc(roomId);
    }

    public Message edit(String id, MessageUpdateRequest request, String email) {
        Message message = message(id);
        if (!email.equals(message.getSenderEmail())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the sender can edit this message");
        }
        message.setContent(request.getContent());
        message.setEdited(true);
        message.setUpdatedAt(LocalDateTime.now());
        return messages.save(message);
    }

    public Message delete(String id, String email) {
        Message message = message(id);
        if (!email.equals(message.getSenderEmail())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the sender can delete this message");
        }
        message.setDeleted(true);
        message.setContent("");
        message.setUpdatedAt(LocalDateTime.now());
        return messages.save(message);
    }

    public Message markDelivered(String id) {
        Message message = message(id);
        message.setStatus(Message.MessageStatus.DELIVERED);
        message.setDeliveredAt(LocalDateTime.now());
        return messages.save(message);
    }

    public Message markSeen(String id) {
        Message message = message(id);
        message.setStatus(Message.MessageStatus.SEEN);
        message.setSeenAt(LocalDateTime.now());
        return messages.save(message);
    }

    public List<Message> search(String keyword) {
        return messages.findByContentContainingIgnoreCaseOrFileNameContainingIgnoreCase(keyword, keyword);
    }

    private Message message(String id) {
        return messages.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Message not found"));
    }
}
