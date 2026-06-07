package com.chatapp.service;

import com.chatapp.exception.ApiException;
import com.chatapp.model.Attachment;
import com.chatapp.repository.AttachmentRepository;
import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {
    private final Cloudinary cloudinary;
    private final AttachmentRepository attachments;
    @Value("${cloudinary.cloud-name:}")
    private String cloudName;
    @Value("${cloudinary.api-key:}")
    private String apiKey;
    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    public Attachment upload(MultipartFile file, String uploadedBy, String receiverEmail, String roomId) {
        try {
            String fileUrl = cloudinaryConfigured() ? uploadToCloudinary(file) : uploadLocally(file);
            return attachments.save(buildAttachment(file, uploadedBy, receiverEmail, roomId, fileUrl));
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "File upload failed: " + ex.getMessage());
        }
    }

    private boolean cloudinaryConfigured() {
        return notBlank(cloudName) && notBlank(apiKey) && notBlank(apiSecret);
    }

    private boolean notBlank(String value) {
        return value != null && !value.isBlank();
    }

    private String uploadToCloudinary(MultipartFile file) throws Exception {
        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), Map.of(
                "folder", "chatsphere",
                "resource_type", "auto"
        ));
        return String.valueOf(result.get("secure_url"));
    }

    private String uploadLocally(MultipartFile file) throws Exception {
        Path uploadDir = Path.of("uploads").toAbsolutePath().normalize();
        Files.createDirectories(uploadDir);
        String originalName = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();
        String extension = "";
        int dot = originalName.lastIndexOf('.');
        if (dot >= 0) {
            extension = originalName.substring(dot).toLowerCase(Locale.ROOT);
        }
        String storedName = UUID.randomUUID() + extension;
        Files.copy(file.getInputStream(), uploadDir.resolve(storedName), StandardCopyOption.REPLACE_EXISTING);
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(storedName)
                .toUriString();
    }

    private Attachment buildAttachment(MultipartFile file, String uploadedBy, String receiverEmail, String roomId, String fileUrl) {
        return Attachment.builder()
                .uploadedBy(uploadedBy)
                .receiverEmail(receiverEmail)
                .roomId(roomId)
                .chatType(roomId == null || roomId.isBlank() ? "PRIVATE" : "GROUP")
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .fileUrl(fileUrl)
                .uploadedAt(LocalDateTime.now())
                .build();
    }

    public List<Attachment> search(String keyword) {
        return attachments.findByFileNameContainingIgnoreCaseOrFileTypeContainingIgnoreCase(keyword, keyword);
    }
}
