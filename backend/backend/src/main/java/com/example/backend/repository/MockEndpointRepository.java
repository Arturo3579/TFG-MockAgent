package com.example.backend.repository;

import com.example.backend.model.MockEndpoint;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MockEndpointRepository extends JpaRepository<MockEndpoint, Long> {
    List<MockEndpoint> findByUser(User user);
    long countByUser(User user);
    Optional<MockEndpoint> findByPathAndMethodAndUser(String path, String method, User user);
    List<MockEndpoint> findByPathAndMethod(String path, String method);
    void deleteByIsDemoTrueAndCreatedAtBefore(LocalDateTime date);
}