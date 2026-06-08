package com.example.backend.controller;

import com.example.backend.exception.RateLimitExceededException;
import com.example.backend.model.MockEndpoint;
import com.example.backend.service.EndpointService;
import com.example.backend.service.RateLimitService;
import com.example.backend.service.RequestLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MockController {

    private final EndpointService endpointService;
    private final RequestLogService requestLogService;
    private final RateLimitService rateLimitService;

    @RequestMapping("/mock/**")
    public ResponseEntity<String> handleMockRequest(
            HttpServletRequest request,
            @RequestBody(required = false) String body) {

        String path = request.getRequestURI().replaceFirst("/mock", "");
        String method = request.getMethod();

        List<MockEndpoint> matches = endpointService.findMatchingEndpoint(path, method);

        if (matches.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"No mock endpoint found for " + method + " " + path + "\"}");
        }

        MockEndpoint endpoint = matches.get(0);
        HttpStatus status = HttpStatus.resolve(endpoint.getStatus());
        if (status == null) status = HttpStatus.OK;

        // Handle instant endpoints (user is null)
        boolean isInstant = endpoint.getUser() == null;
        
        if (!isInstant) {
            boolean allowed = rateLimitService.isAllowed(
                    endpoint.getUser().getId(),
                    endpoint.getUser().getPlan().name()
            );

            if (!allowed) {
                throw new RateLimitExceededException("Rate limit excedido. Reduce la frecuencia de peticiones o upgrade a Pro.");
            }

            requestLogService.logRequest(
                    endpoint.getUser().getEmail(),
                    method,
                    path,
                    status.value(),
                    endpoint,
                    body
            );
        } else {
            // Instant endpoints: log with anonymous user
            requestLogService.logRequest(
                    "instant@mockagent.com",
                    method,
                    path,
                    status.value(),
                    endpoint,
                    body
            );
        }

        return ResponseEntity.status(status)
                .header("Content-Type", "application/json")
                .body(endpoint.getResponseBody());
    }
}