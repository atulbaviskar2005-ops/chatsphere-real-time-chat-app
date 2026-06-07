package com.chatapp.service;

import com.chatapp.dto.UserProfileRequest;
import com.chatapp.exception.ApiException;
import com.chatapp.model.User;
import com.chatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository users;

    public List<User> all() {
        return users.findAll();
    }

    public User one(String id) {
        return users.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public User byEmail(String email) {
        return users.findByEmail(email).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public List<User> search(String keyword) {
        return users.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword);
    }

    public User updateProfile(String email, UserProfileRequest request) {
        User user = byEmail(email);
        if (request.getName() != null) user.setName(request.getName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getProfileImage() != null) user.setProfileImage(request.getProfileImage());
        if (request.getDesktopNotifications() != null) user.setDesktopNotifications(request.getDesktopNotifications());
        if (request.getSoundNotifications() != null) user.setSoundNotifications(request.getSoundNotifications());
        if (request.getPrivateLastSeen() != null) user.setPrivateLastSeen(request.getPrivateLastSeen());
        user.setUpdatedAt(LocalDateTime.now());
        return users.save(user);
    }

    public User presence(String email, User.PresenceStatus status) {
        User user = byEmail(email);
        user.setStatus(status);
        user.setLastSeen(LocalDateTime.now());
        return users.save(user);
    }
}
