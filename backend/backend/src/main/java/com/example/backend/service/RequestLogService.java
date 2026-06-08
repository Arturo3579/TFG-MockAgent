package com.example.backend.service;

import com.example.backend.dto.RequestLogDto;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.MockEndpoint;
import com.example.backend.model.PlanType;
import com.example.backend.model.RequestLog;
import com.example.backend.model.User;
import com.example.backend.repository.RequestLogRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestLogService {

    private final RequestLogRepository requestLogRepository;
    private final UserRepository userRepository;

    public void logRequest(String email, String method, String path, Integer statusCode, MockEndpoint endpoint, String requestBody) {
        User user = userRepository.findByEmail(email).orElse(null);

        RequestLog log = RequestLog.builder()
                .timestamp(LocalDateTime.now())
                .method(method)
                .path(path)
                .statusCode(statusCode)
                .endpoint(endpoint)
                .user(user)
                .requestBody(requestBody)
                .build();

        requestLogRepository.save(log);
    }

    public List<RequestLogDto> getLogsByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        LocalDateTime since = calculateRetentionDate(user.getPlan());

        return requestLogRepository.findTop50ByUserAndTimestampAfterOrderByTimestampDesc(user, since).stream()
                .map(this::toDto)
                .toList();
    }

    private LocalDateTime calculateRetentionDate(PlanType plan) {
        return switch (plan) {
            case STARTER -> LocalDateTime.now().minusHours(24);
            case PRO -> LocalDateTime.now().minusDays(7);
            case PREMIUM, ENTERPRISE -> LocalDateTime.now().minusDays(14);
        };
    }

    private RequestLogDto toDto(RequestLog log) {
        return RequestLogDto.builder()
                .id(log.getId())
                .timestamp(log.getTimestamp())
                .method(log.getMethod())
                .path(log.getPath())
                .statusCode(log.getStatusCode())
                .endpointId(log.getEndpoint() != null ? log.getEndpoint().getId() : null)
                .build();
    }
}
