package com.chatapp.controller;

import com.chatapp.model.Attachment;
import com.chatapp.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
    private final FileStorageService files;

    @PostMapping("/upload")
    public Attachment upload(
            Authentication authentication,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String receiverEmail,
            @RequestParam(required = false) String roomId) {
        return files.upload(file, authentication.getName(), receiverEmail, roomId);
    }
}
