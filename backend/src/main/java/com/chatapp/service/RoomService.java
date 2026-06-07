package com.chatapp.service;

import com.chatapp.dto.RoomMemberRequest;
import com.chatapp.exception.ApiException;
import com.chatapp.model.ChatRoom;
import com.chatapp.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final ChatRoomRepository rooms;

    public ChatRoom create(ChatRoom room, String creatorEmail) {
        LocalDateTime now = LocalDateTime.now();
        room.setCreatedBy(creatorEmail);
        room.getAdmins().add(creatorEmail);
        room.getMembers().add(creatorEmail);
        room.setCreatedAt(now);
        room.setUpdatedAt(now);
        return rooms.save(room);
    }

    public List<ChatRoom> myRooms(String email) {
        return rooms.findByMembersContaining(email);
    }

    public ChatRoom get(String id) {
        return rooms.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Room not found"));
    }

    public ChatRoom update(String id, ChatRoom update, String email) {
        ChatRoom room = get(id);
        requireAdmin(room, email);
        if (update.getName() != null) room.setName(update.getName());
        if (update.getDescription() != null) room.setDescription(update.getDescription());
        if (update.getGroupImage() != null) room.setGroupImage(update.getGroupImage());
        room.setUpdatedAt(LocalDateTime.now());
        return rooms.save(room);
    }

    public ChatRoom join(String id, String email) {
        ChatRoom room = get(id);
        room.getMembers().add(email);
        room.setUpdatedAt(LocalDateTime.now());
        return rooms.save(room);
    }

    public ChatRoom leave(String id, String email) {
        ChatRoom room = get(id);
        room.getMembers().remove(email);
        room.getAdmins().remove(email);
        if (room.getAdmins().isEmpty() && !room.getMembers().isEmpty()) {
            room.getAdmins().add(room.getMembers().iterator().next());
        }
        room.setUpdatedAt(LocalDateTime.now());
        return rooms.save(room);
    }

    public ChatRoom addMember(String id, RoomMemberRequest request, String adminEmail) {
        ChatRoom room = get(id);
        requireAdmin(room, adminEmail);
        room.getMembers().add(request.getEmail());
        room.setUpdatedAt(LocalDateTime.now());
        return rooms.save(room);
    }

    public ChatRoom removeMember(String id, RoomMemberRequest request, String adminEmail) {
        ChatRoom room = get(id);
        requireAdmin(room, adminEmail);
        room.getMembers().remove(request.getEmail());
        room.getAdmins().remove(request.getEmail());
        room.setUpdatedAt(LocalDateTime.now());
        return rooms.save(room);
    }

    public List<ChatRoom> search(String keyword) {
        return rooms.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

    private void requireAdmin(ChatRoom room, String email) {
        if (!room.getAdmins().contains(email)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only group admins can perform this action");
        }
    }
}
