package com.chatapp.repository;
import com.chatapp.model.User;import org.springframework.data.mongodb.repository.MongoRepository;import java.util.*;
public interface UserRepository extends MongoRepository<User,String>{ Optional<User> findByEmail(String email); boolean existsByEmail(String email); List<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name,String email); }
