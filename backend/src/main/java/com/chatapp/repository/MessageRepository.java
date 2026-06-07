package com.chatapp.repository;

import com.chatapp.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByRoomIdOrderByCreatedAtAsc(String roomId);
    List<Message> findBySenderEmailAndReceiverEmailOrSenderEmailAndReceiverEmailOrderByCreatedAtAsc(String s1, String r1, String s2, String r2);
    List<Message> findByContentContainingIgnoreCaseOrFileNameContainingIgnoreCase(String content, String fileName);
}
