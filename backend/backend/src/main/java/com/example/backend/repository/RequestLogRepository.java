package com.example.backend.repository;

import com.example.backend.model.RequestLog;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RequestLogRepository extends JpaRepository<RequestLog, Long> {
    List<RequestLog> findTop50ByUserOrderByTimestampDesc(User user);
    List<RequestLog> findTop50ByUserAndTimestampAfterOrderByTimestampDesc(User user, LocalDateTime since);
}
