package com.chatapp.controller;

import com.chatapp.dto.UserProfileRequest;
import com.chatapp.model.User;
import com.chatapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService users;

    @GetMapping
    public List<User> all() {
        return users.all();
    }

    @GetMapping("/search")
    public List<User> search(@RequestParam String keyword) {
        return users.search(keyword);
    }

    @GetMapping("/me")
    public User me(Authentication authentication) {
        return users.byEmail(authentication.getName());
    }

    @GetMapping("/{id}")
    public User one(@PathVariable String id) {
        return users.one(id);
    }

    @PutMapping("/profile")
    public User updateProfile(Authentication authentication, @RequestBody UserProfileRequest request) {
        return users.updateProfile(authentication.getName(), request);
    }
}
