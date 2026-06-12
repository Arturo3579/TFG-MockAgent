package com.example.backend.service;

import com.example.backend.dto.EndpointDto;
import com.example.backend.dto.EndpointRequest;
import com.example.backend.exception.EndpointNotFoundException;
import com.example.backend.exception.PlanLimitExceededException;
import com.example.backend.exception.UnauthorizedEndpointException;
import com.example.backend.exception.UserNotFoundException;
import com.example.backend.model.MockEndpoint;
import com.example.backend.model.PlanType;
import com.example.backend.model.User;
import com.example.backend.repository.MockEndpointRepository;
import com.example.backend.repository.RequestLogRepository;
import com.example.backend.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EndpointService {

    private final MockEndpointRepository endpointRepository;
    private final UserRepository userRepository;
    private final RequestLogRepository requestLogRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final int STARTER_LIMIT = 5;
    private static final int PRO_LIMIT = Integer.MAX_VALUE;

    public List<EndpointDto> getEndpointsByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        return endpointRepository.findByUser(user).stream()
                .map(this::toDto)
                .toList();
    }

    public EndpointDto createEndpoint(String email, EndpointRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        long currentCount = endpointRepository.countByUser(user);
        checkPlanLimit(user.getPlan(), currentCount);

        validateJson(request.getResponseBody());

        // Normalizar path: asegurar que empieza con /
        String normalizedPath = request.getPath();
        if (!normalizedPath.startsWith("/")) {
            normalizedPath = "/" + normalizedPath;
        }

        MockEndpoint endpoint = MockEndpoint.builder()
                .path(normalizedPath)
                .method(request.getMethod().toUpperCase())
                .status(request.getStatus() != null ? request.getStatus() : 200)
                .responseBody(request.getResponseBody() != null ? request.getResponseBody() : "{}")
                .user(user)
                .build();

        return toDto(endpointRepository.save(endpoint));
    }

    public EndpointDto updateEndpoint(String email, Long id, EndpointRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        MockEndpoint endpoint = endpointRepository.findById(id)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint no encontrado"));

        if (!endpoint.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedEndpointException("No tienes permiso para editar este endpoint");
        }

        validateJson(request.getResponseBody());

        endpoint.setPath(request.getPath());
        endpoint.setMethod(request.getMethod().toUpperCase());
        endpoint.setStatus(request.getStatus() != null ? request.getStatus() : 200);
        endpoint.setResponseBody(request.getResponseBody() != null ? request.getResponseBody() : "{}");

        return toDto(endpointRepository.save(endpoint));
    }

    @Transactional
    public void deleteEndpoint(String email, Long id) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        MockEndpoint endpoint = endpointRepository.findById(id)
                .orElseThrow(() -> new EndpointNotFoundException("Endpoint no encontrado"));

        if (!endpoint.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedEndpointException("No tienes permiso para eliminar este endpoint");
        }

        // Borrar logs asociados primero para evitar error de foreign key
        requestLogRepository.deleteByEndpoint_Id(id);
        
        endpointRepository.delete(endpoint);
    }

    public List<MockEndpoint> findMatchingEndpoint(String path, String method) {
        String upperMethod = method.toUpperCase();
        // Buscar primero con el path exacto
        List<MockEndpoint> matches = endpointRepository.findByPathAndMethod(path, upperMethod);
        if (!matches.isEmpty()) {
            return matches;
        }
        // Si no se encuentra y el path empieza con /, buscar sin el /
        if (path.startsWith("/")) {
            matches = endpointRepository.findByPathAndMethod(path.substring(1), upperMethod);
        } else {
            // Si no empieza con /, buscar con /
            matches = endpointRepository.findByPathAndMethod("/" + path, upperMethod);
        }
        return matches;
    }

    private void checkPlanLimit(PlanType plan, long currentCount) {
        int limit = switch (plan) {
            case STARTER -> STARTER_LIMIT;
            case PRO, PREMIUM, ENTERPRISE -> PRO_LIMIT;
        };

        if (currentCount >= limit) {
            throw new PlanLimitExceededException("Has alcanzado el límite de endpoints de tu plan " + plan.name().toLowerCase() +
                    ". Upgrade a Pro para endpoints ilimitados.");
        }
    }

    private void validateJson(String json) {
        if (json == null || json.isBlank()) return;
        try {
            objectMapper.readTree(json);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("El response body no es un JSON válido");
        }
    }

    private EndpointDto toDto(MockEndpoint e) {
        return EndpointDto.builder()
                .id(e.getId())
                .path(e.getPath())
                .method(e.getMethod())
                .status(e.getStatus())
                .responseBody(e.getResponseBody())
                .build();
    }
}