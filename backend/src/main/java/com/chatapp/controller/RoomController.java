package com.chatapp.controller;

import com.chatapp.dto.RoomMemberRequest;
import com.chatapp.model.ChatRoom;
import com.chatapp.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService rooms;

    @PostMapping
    public ChatRoom create(Authentication authentication, @RequestBody ChatRoom room) {
        return rooms.create(room, authentication.getName());
    }

    @GetMapping
    public List<ChatRoom> my(Authentication authentication) {
        return rooms.myRooms(authentication.getName());
    }

    @GetMapping("/{id}")
    public ChatRoom get(@PathVariable String id) {
        return rooms.get(id);
    }

    @PutMapping("/{id}")
    public ChatRoom update(Authentication authentication, @PathVariable String id, @RequestBody ChatRoom room) {
        return rooms.update(id, room, authentication.getName());
    }

    @PostMapping("/{id}/join")
    public ChatRoom join(Authentication authentication, @PathVariable String id) {
        return rooms.join(id, authentication.getName());
    }

    @PostMapping("/{id}/leave")
    public ChatRoom leave(Authentication authentication, @PathVariable String id) {
        return rooms.leave(id, authentication.getName());
    }

    @PostMapping("/{id}/add-member")
    public ChatRoom addMember(Authentication authentication, @PathVariable String id, @RequestBody RoomMemberRequest request) {
        return rooms.addMember(id, request, authentication.getName());
    }

    @PostMapping("/{id}/remove-member")
    public ChatRoom removeMember(Authentication authentication, @PathVariable String id, @RequestBody RoomMemberRequest request) {
        return rooms.removeMember(id, request, authentication.getName());
    }

    @GetMapping("/search")
    public List<ChatRoom> search(@RequestParam String keyword) {
        return rooms.search(keyword);
    }
}
