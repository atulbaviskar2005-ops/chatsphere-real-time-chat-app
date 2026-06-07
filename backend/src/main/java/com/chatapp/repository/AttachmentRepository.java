package com.chatapp.repository;

import com.chatapp.model.Attachment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AttachmentRepository extends MongoRepository<Attachment, String> {
    List<Attachment> findByUploadedByOrReceiverEmailOrRoomId(String uploadedBy, String receiverEmail, String roomId);
    List<Attachment> findByFileNameContainingIgnoreCaseOrFileTypeContainingIgnoreCase(String fileName, String fileType);
}
